# SD File Tools

The **SD File Tools** hub (`/sdf-tools`) gathers everything a Sponsor needs to work with an
SD File (Structure-Data File) into one place, so users don't have to chase the pieces around
the application.

It has three tabs:

| Tab | Purpose | Access |
| --- | --- | --- |
| **Validate** | Embeds the FDA-authored, offline-capable SD File Validator. | Public — no login. |
| **Import** | Turns an SD File into GSRS substance JSON. Deployment-aware (see below). | Public route; the flow itself is gated per deployment. |
| **Guide** | Quick Guide PDF, sample SD File, expected headers, FDA support contacts. | Public — no login. |

The active tab is mirrored into a `?tab=` query parameter, so `/sdf-tools?tab=import` is
directly linkable.

## Layout

```
src/app/core/sdf-tools/
├── sdf-tools.constants.ts        # asset filenames, tab ids, Quick Guide headers, contacts
├── sdf-tools.module.ts
├── sdf-tools.component.*         # hub shell: mat-tab-group + ?tab= deep linking
├── sdf-validator/                # sandboxed iframe host for the FDA validator
├── sdf-import/
│   ├── sdf-import.service.ts     # the read-only-safe SDF -> GSRS JSON pipeline
│   └── sdf-import.component.*    # deployment-aware stepper / privileged links
└── sdf-guide/                    # reference tab

src/app/core/assets/sdf-tools/
├── SD_File_Validator_2_1.html
├── Quick_Guide_SDF_eCTD_508.pdf
└── 00_SampleSDF_MF012345_API_Name.sdf
```

`angular.json` already copies `src/app/core/assets/**/*` to `/assets/`, so these files are
served at `assets/sdf-tools/…` with no build configuration change.

## The Validate tab

The validator is an FDA/GSRS-authored, entirely self-contained HTML file (it embeds
JSChemify) that runs in the browser with no network access. GSRS hosts it **verbatim** and
embeds it in an `<iframe>`.

**Do not fork or edit the validator HTML.** The iframe approach exists precisely so the FDA
team keeps ownership of the validation rules. Any local edit creates a divergence that will
rot the moment they publish a new version.

Notes on the embed:

- The iframe `src` is built from `configService.environment.baseHref` (same technique as
  `pfda-toolbar.component.ts`) so it resolves correctly under sub-path deployments, then
  passed through `DomSanitizer.bypassSecurityTrustResourceUrl`.
- The sandbox is `allow-scripts allow-downloads allow-popups allow-modals` — deliberately
  **without** `allow-same-origin`, so the tool cannot reach GSRS session state. The tool does
  no network I/O, so this should hold; the report download is the likeliest casualty if a
  future version changes how it emits files. If the sandbox has to be relaxed, relax it
  minimally and document why here.
- `window`/`document` access is behind `isPlatformBrowser` because this repo supports SSR.
- The page also offers "Open in new tab" and a direct download, preserving the tool's
  offline value for Sponsors who want to run it without visiting GSRS.

### Dropping in a new validator version

1. Copy the new HTML into `src/app/core/assets/sdf-tools/`.
2. Update `SDF_VALIDATOR_FILENAME` in `sdf-tools.constants.ts`.

That is the whole change — the filename is pinned in exactly one place. (The v2.1 user guide's
System Requirements section still references `SD_File_Validator_2_0.html`; trust the actual
file you were given, not that string.)

Check the new file against the build budget — it is large because JSChemify is inlined.

### Verified against the real v2.1 file

The FDA-authored `SD_File_Validator_2_1.html` (369 KB, SHA-256 `90fd02c9…0f4b`) was audited
and driven end-to-end inside the exact sandbox above:

- **Self-contained**: zero external `src`/`href` resource loads — the only absolute URLs are
  four ordinary hyperlinks (UNII Search, NCATS GSRS, two FDA Quick Guide pages). Two inline
  `<script>` blocks, no `fetch`/`XMLHttpRequest`, no forms.
- **Sandbox-safe**: uses no `localStorage`/`sessionStorage`/`document.cookie`, so the missing
  `allow-same-origin` costs it nothing. (Storage access does throw `SecurityError` in the
  frame, as expected — the tool simply never asks.)
- **Functional**: feeding it `00_SampleSDF_MF012345_API_Name.sdf` produced
  "SUCCESS: Validation complete!", four rendered SVG structures and a populated data table,
  with no exceptions or console errors in the frame.
- **Download works** under `allow-downloads`: the button emitted
  `00_SampleSDF_MF012345_API_Name_ValidationReport.txt`, matching the user guide's
  `[YourFileName]_ValidationReport.txt`.
- The `target="_blank"` hyperlinks need `allow-popups`; that is why the flag is present.
  `allow-modals` is currently unused by the tool (no `alert`/`confirm`) and could be dropped.

Worth knowing if you ever need to re-run this: recent Chrome puts sandboxed opaque-origin
iframes in their own process, so older automation cannot see the child frame at all. Launch
with `--disable-features=IsolateSandboxedIframes --disable-site-isolation-trials` to keep it
in-process; the sandbox restrictions themselves still apply. Note also that a programmatic
`element.click()` does **not** grant user activation, so the file chooser will not open —
drive it with a real `Input.dispatchMouseEvent` at the input's screen coordinates, otherwise
you will "verify" a code path no user can reach.

### The validator needs its own CSP on precisionFDA

**Symptom** (this cost real time, so it is written down): the validator renders perfectly —
heading, upload box, styling, all correct — but choosing a file does nothing. No visible
error. The tool looks installed and simply is not.

**Cause.** pFDA sends a site-wide CSP from
`packages/rails/config/initializers/secure_headers.rb`. Its `script-src` includes
`'unsafe-inline'`, but its `script-src-elem` does not — and **`script-src-elem` overrides
`script-src` for `<script>` elements**. The validator's logic is 100% inline `<script>`, so
both blocks are parsed into the DOM (`document.scripts.length === 2`) and never executed:
`typeof handleFileSelect === 'undefined'`. The static markup still renders, which is exactly
why it looks fine. The `change` listener is registered inside a `DOMContentLoaded` handler in
the second block, so it never attaches.

It is **not** the iframe or the sandbox — a direct top-level navigation to the asset fails
identically.

**Fix.** `GinasUnauthorizedController` (which serves `/ginas/*path`, and therefore this asset)
overrides the CSP for the validator asset *only*, via a `before_action` gated on
`%r{/assets/sdf-tools/[A-Za-z0-9_.-]+\.html\z}`. Because the tool is self-contained, that
bespoke policy is *tighter* than the site default, not looser — `default-src 'none'`,
`connect-src 'none'`, `form-action 'none'`, `object-src 'none'`, with `'unsafe-inline'`
granted for scripts and styles and `data:`/`blob:` allowed for `img-src` (the rendered
structures and the report download). The site-wide CSP is untouched; verify with:

```bash
curl -skD - .../ui/assets/sdf-tools/SD_File_Validator_2_1.html | grep -i content-security
curl -skD - .../ui/sdf-tools                                   | grep -i content-security
```

The first should show `default-src 'none'`, the second the global policy.

Rejected alternatives: adding `'unsafe-inline'` to `script-src-elem` globally (weakens every
page); CSP script hashes (breaks on every validator version bump); extracting the scripts to
external files (forbidden — the FDA file stays verbatim).

The regex deliberately matches any `.html` under `assets/sdf-tools/`, so a version bump needs
no backend change. If you ever add a *second* HTML file to that directory, remember it
inherits this policy.

## The Import tab

### precisionFDA deployment (`isPfdaVersion`)

**The constraint that shapes this entire flow: in pFDA the admin panel and staging area are
not exposed, and the GSRS database is read-only with no admin privileges.** The conventional
import → stage → bulk *Create* → write-to-DB path is therefore unusable.

The workaround is that the backend import API can convert an SD File into complete GSRS
substance JSON **without creating any substance records**:

| Step | Call | Persists? |
| --- | --- | --- |
| 0. Resolve adapter | `adminService.getAdapters()` → `GET api/v1/substances/import/adapters` | No. Picks the adapter key this deployment registers for `.sdf`. |
| 1. Upload | `adminService.postAdapterFile(form, adapterKey)` → `POST api/v1/substances/import?adapter=…` | **Yes** — writes a `Payload` (a row in `ix_core_payload` and a file under `${ix.home}/payload/`). No substance record. See "Upload is not read-only" below. |
| 2. Convert | `adminService.previewAdapter(id, settings, 'all')` → `PUT api/v1/substances/import/{id}/@preview?limit=500000` | **No.** Returns `dataPreview[].data` — full substance JSON with `names`, `codes`, `structure.molfile/formula/mwt`. |
| 3. Review | client-side only | No |
| 4a. Download | client-side `Blob` + object URL | No. Available to **everyone**, signed in or not. |
| 4b. Submit | `substanceService.saveSubstance(record, 'import')` per selected record | In pFDA the backend writes a JSON file to the user's My Home and returns a `fileUrl`. Requires sign-in. |
| 5. Done | Summary with per-record My Home links and a **Go to My Home** action (`pfdaBaseUrl + 'home'`) | — |

#### Upload is not read-only

Step 1 is often described as harmless. It is not. `handleImport` in
`AbstractImportSupportingGsrsEntityController` calls
`payloadService.createPayload(…, PayloadPersistType.TEMP)`, and in `LegacyPayloadService`
the `TEMP` flag does far less than the name suggests: the `ATOMIC_MOVE` into
`${ix.home}/payload/` and the `payloadRepository.saveAndFlush(payload)` both happen
unconditionally. `TEMP` only skips an *extra* copy (`FileData` row or second location). No
reaper for `TEMP` payloads exists anywhere in the starter, so every uploaded SD File stays
on disk and in `ix_core_payload` indefinitely.

There is also a temp-file leak: when the SHA-1 dedup hits (same file uploaded twice),
`persistFile` is never called, so the `___*.tmp` staging file is neither moved nor deleted.

Only step 2 (`@preview`) is genuinely free of side effects — `handlePreview` streams objects
in memory and returns JSON. This distinction matters for the privilege discussion below, and
has been raised with the GSRS backend team.

### Signed out vs signed in

pFDA proxies logged-out traffic as the `pfda-guest` profile (see the authorization section
below), so **conversion works anonymously** — an anonymous visitor gets the full upload,
convert and review experience.

What an anonymous visitor does *not* have is a My Home area, so the review step offers two
distinct actions:

- **Download … as JSON** — shown to everyone. Writes the selected records to the user's own
  machine via a `Blob` and an object URL. One selected record downloads as a bare object (so it
  can be fed straight back into GSRS); several download as an array. The filename is derived
  from the uploaded SD File, e.g. `sample.sdf` → `sample-gsrs.json`.
- **Submit … to My Home** when signed in, or **Sign in to save to My Home** when not. The
  latter opens the pFDA login popup via `authService.pfdaLogin()` and, on success, continues
  straight into the submission the user originally asked for. If the user cancels the popup,
  nothing is submitted and the message points them back at the download option.

`isSignedIn` is resolved from `authService.getAuth()` for the pFDA path (mirroring
`pfda-toolbar.component.ts`). Do not gate the *download* button on it — being able to keep the
converted JSON without an account is a deliberate requirement.

> ### ⚠️ Never hardcode the adapter key
>
> The set of import adapters is **deployment configuration**, not a constant. An early version
> of this feature posted `adapter=SDF` and every conversion failed with HTTP 500 and
> `Cannot predict settings with unknown import adapter:"SDF"` — the local GSRS 3.2.0 stack
> registers its SD File adapter under a different key entirely.
>
> `SdfImportService.resolveAdapterKey()` therefore asks the server which adapters exist and
> matches the uploaded file's extension against each adapter's `fileExtensions`, falling back
> to an adapter whose key or name mentions "SDF". If nothing matches, the user is shown the
> list of adapters the server actually offers rather than an opaque 500. This mirrors what the
> admin import UI has always done — it never hardcoded a key either, it renders a picker from
> the same endpoint.

> ### ⚠️ Never call the DB-writing endpoints in the pFDA path
>
> `@execute`, `@executeasync` and `stagingArea/@bulkactasync` all persist to the substance
> store. They must **never** be wired into this flow. The easiest way to break this feature is
> to reach for the staging *Create* action because it looks like the natural fit — it is not
> available here. Preview-only conversion plus per-record `saveSubstance` is the whole trick.

Submission is sequential (`concatMap`) with a progress indicator, and each record has its own
`catchError`. A 50-record SD File where record 37 fails must still deliver the other 49 and
report the failure clearly — it must not roll back or silently stop.

Sharing the resulting JSON into a review Space is **out of scope for GSRS**: once the files
are in My Home the user shares them through the pFDA UI.

### Standard deployment (`!isPfdaVersion`)

Nothing about the existing admin import machinery changes. The tab resolves
`authService.getAuth()` and `hasSpecificPrivilege('Import Data')` and renders:

- **privileged** → links to `/admin/import` and `/staging`;
- **unauthenticated** → a sign-in prompt;
- **authenticated but unprivileged** → an explanation of the missing privilege.

`/admin/import` and `/staging` also cross-link back to the hub.

## Discoverability

- **pFDA build**: an entry in the `.gsrs-dropdown` of `pfda-toolbar.component.html`. This is
  the *only* route in for pFDA users — `base.component.html` renders the standard GSRS toolbar
  only when `!isPfdaVersion`, so the usual nav is absent. Do not remove it.
- **Standard build**: a `navItems` entry in both `src/app/core/config/config.json` and
  `src/app/fda/config/config.json`.
- **Both builds**: the "Other" panel of the home-page sidebar (`home.component.html`). The
  panel used to be `*ngIf="loadedComponents"` — that guard moved down onto the inner `<span>`
  wrapping the `Browse …` links so the panel still renders (and the SD File Tools link is
  still reachable) on deployments with no optional components loaded. Keep the guard on the
  inner span: the `Browse …` items dereference `loadedComponents.*` directly.

## Gotchas

- **The route is public.** Nothing in the hub may eagerly call authenticated endpoints on
  init, or anonymous Sponsors will see errors on the Validate tab.
- **A silently inert validator is a CSP problem, not a sandbox problem.** If the tool renders
  but the file picker does nothing, check `script-src-elem` — see
  "The validator needs its own CSP on precisionFDA" above.
- **The page must clear the fixed toolbar.** The app's single-row `.mat-toolbar` (both the
  GSRS header and the pFDA toolbar) is `position: fixed; top: 0; height: 64px` — see
  `.mat-toolbar:not(.mat-toolbar-multiple-rows)` in `styles/_material-overrides.scss`. It is
  out of the document flow and there is no global content offset, so a routed page that starts
  at the top of the viewport renders *underneath* it. `.sdf-tools-container` adds the 64px
  itself; keep that if you touch the padding.
- **Preview limit.** `previewAdapter` maps `'all'` to `500000`. That is fine for real SD Files,
  but a large file means one long request — keep the progress indicator.
- **Structure images.** `resolveStructureImages()` calls
  `structureService.interpretStructure(molfile)` to populate `structureID` for
  `appSubstanceImage`. Failures are swallowed on purpose: a structure that won't render must
  not block an otherwise valid import.
- **Barrel imports and cycles.** `admin.service.ts` imports `Auth` and `FacetHttpParams` from
  their concrete module paths rather than the `@gsrs-core/auth` / `@gsrs-core/facets-manager`
  barrels. The barrels re-export modules/components that import back into `AdminService`,
  producing a `Cannot access 'AdminService' before initialization` failure at runtime. Keep
  those imports on their sub-paths.

## Tests

```bash
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  npx ng test gsrs-client --browsers=ChromeHeadless --watch=false \
  --include='app/core/sdf-tools/**/*.spec.ts'
```

The `--include` flag scopes the Angular 13 karma builder's `FindTestsPlugin` to these specs.
This matters because the repo-wide Karma run is broken independently of this feature: the root
`tsconfig.json` `exclude` list contains `**/*.spec.ts`, which `src/tsconfig.spec.json`
inherits, so a bare `ng test` reports hundreds of "missing from the TypeScript compilation"
errors. The same root cause makes `npm run lint` report a parsing error for every `*.spec.ts`
file in the repo, new and old alike.

## Backend prerequisite: the SDF adapter must actually load

The Import tab is only as good as the adapters the server registers. If
`GET api/v1/substances/import/adapters` returns `[]`, no SD File can be converted and every
upload fails with `Cannot predict settings with unknown import adapter`.

This bit us on the pFDA stack. In `precision-fda/packages/gsrs/web/config/application.conf`
**two** adapters were defined as a JSON array under the single `SDFImportAdapterFactory` key:

```hocon
gsrs.importAdapterFactories.substances.list.SDFImportAdapterFactory =
  [                                             # <-- wrong
    { "adapterName": "SDF Adapter", ... },
    { "adapterName": "GSRS JSON Adapter", ... } # <-- and this one was invisible too
  ]
```

GSRS binds `importAdapterFactories` as
`Map<String, Map<String, Map<String, Map<String, Object>>>>` (see `GsrsFactoryConfiguration`),
so the value under each adapter key **must be a bare object**. A list cannot bind to
`Map<String, Object>`, so *both* adapters were silently dropped at startup — no error surfaced
to the client, the adapter list was simply empty.

The fix is to give each adapter its own key, matching the reference deployment
(`gsrs3-main-deployment/substances/src/main/resources/substances-import.conf`, which defines
`SDFImportAdapterFactory` and `GSRSJSONImportAdapterFactory` as separate keys):

```hocon
gsrs.importAdapterFactories.substances.list.SDFImportAdapterFactory =
        { "adapterName": "SDF Adapter", ... }

gsrs.importAdapterFactories.substances.list.GSRSJSONImportAdapterFactory =
        { "adapterName": "GSRS JSON Adapter", ... }
```

Deleting only the `[` and `]` is **not** enough and will break startup with
`ConfigException$Parse: expecting a close parentheses ')' here, not: '{'`, because it leaves
the two objects juxtaposed with nothing binding the second one to a key.

Three tells that generalise:

- Every other `gsrs.*.list.<Name>` entry in the same file uses a bare object. If one entry is
  wrapped in `[ ]`, that entry is the suspect.
- Count the elements in the array before unwrapping it — an array of *n* objects means *n*
  adapters need *n* separate keys, not one.
- The loader logs `exception during import adapter factory init:` when a factory config fails
  to bind, so `grep` the substances `spring.log` before assuming the frontend is at fault.

Note also that the config key is `supportedFileExtensions`, while the JSON the client receives
exposes it as `fileExtensions` — the controller renames it. `resolveAdapterKey()` reads the
client-side name.

### The config is regenerated on every container start

Editing `webapps/substances/WEB-INF/classes/application.conf` inside the running container
**does not survive a restart**. The pFDA image's `entrypoint.sh` runs:

```bash
envsubst < /tmp/application.conf.template > "$WEBAPPS/substances/WEB-INF/classes/application.conf"
```

so the expanded file is overwritten from the template every time. Fix
`packages/gsrs/web/config/application.conf` in the repo (it is baked in as the template at
image build); to test without a rebuild, `docker cp` over `/tmp/application.conf.template`
and restart. The template still contains `${HOST}`, `${GSRS_DATABASE_HOST}` and friends —
never copy an already-expanded file back over the template.

## Authorization: why import returned 401, and how it is now allowed

Every import endpoint in `AbstractImportSupportingGsrsEntityController` is annotated
`@canImportData`, which is simply:

```java
@PreAuthorize("@permission.canDo('Import Data')")
```

It is **not** a hardcoded admin role. `PrivilegeService` resolves the privilege against the
file named by `gsrs.security.info.filepath` (on pFDA: `/usr/local/tomcat/conf/roles_config.json`).

The catch is that pFDA authenticates *logged-out* traffic too. `ginas_unauthorized_controller.rb`
injects `AUTHENTICATION_USERNAME: "pfda-guest"` for anonymous requests, and in the GSRS database
that profile carries exactly the same roles as a real user:

| Username | `ROLES_JSON` |
| --- | --- |
| `PFDA-GUEST` | Query, Updater, SuperUpdate, DataEntry, SuperDataEntry |
| a real user | Query, Updater, SuperUpdate, DataEntry, SuperDataEntry |
| `ADMIN` | ...the above plus Approver, Admin |

So **`roles_config.json` cannot distinguish anonymous from authenticated callers** — any
privilege granted to `DataEntry` is also granted to the public. (`Updater`, `SuperUpdate` and
`SuperDataEntry` are not defined in `roles_config.json` at all; `canRolePerform` matches roles
by name, so they resolve to nothing and are effectively inert.)

`Import Data` is also a single coarse privilege: granting it unlocks ~30 endpoints, including
destructive ones — `@execute`, `@executeasync`, `stagingArea/@bulkactasync`, `@delete`,
`@deletebulk`, `@update`, `@act`.

The two-part fix is therefore **grant the privilege, then constrain the surface at the proxy**:

1. `packages/gsrs/web/config/roles_config.json` — add `"Import Data"` to the `DataEntry` role.
2. `packages/gsrs/nginx/nginx.conf` — allowlist only the three endpoints the hub needs and
   refuse everything else under `import/` and `stagingArea/`:

   | Method | Path | Purpose |
   | --- | --- | --- |
   | GET | `.../substances/import/adapters` | list adapters |
   | POST | `.../substances/import` | upload the SD File |
   | PUT | `.../substances/import/{uuid}/@preview` | convert (persists nothing) |

All GSRS traffic funnels through that nginx (browser → rails `ginas_unauthorized#index` →
`GSRS_URL=http://gsrs-nginx:80` → `gsrs-web:8080`), so it is a genuine chokepoint. The rules are
**deny-by-default**: nginx normalises the URI before matching, so encoded variants
(`%40execute`, `import(uuid)`, `..` traversal) can only fail closed, never bypass.

Two nginx gotchas worth remembering:

- A `location` regex containing `{n}` (such as the `{36}` UUID quantifier) **must be quoted**,
  or nginx reads the brace as a block delimiter and fails with `unknown directive`.
- Regex locations are matched in order and take precedence over the `/ginas/app/` prefix
  location, so the catch-all deny rule must come after the three allow rules.

After changing either file, restart Tomcat (roles are read once at startup) and reload nginx.
Restarting the GSRS container changes its IP, so **reload nginx afterwards** or it will keep
proxying to the stale upstream address and return 502.

## Verified end to end

Against the local pFDA stack, as `pfda-guest` (i.e. logged out):

| Step | Result |
| --- | --- |
| `GET /import/adapters` | 200 — `SDF` (`sdf`/`sd`/`sdfile`) and `GSRSJSON` |
| `POST /import?adapter=SDF` | 200 — `RecordCount: 4`, all Quick Guide headers detected |
| `PUT /import/{id}/@preview` | 200 — `completeSuccess: true`, 4 substances with names, CAS codes, structures/formulas, notes and references |
| `@execute`, `@executeasync`, `stagingArea/*` | 403 at nginx |

The `@preview` body must be the **whole** `ImportTaskMetaData` object returned by the upload
(that is what `convertRecords()` sends). Posting just its `adapterSettings` fails with
`Unrecognized field "actions"`.

Note that upload is not purely read-only: `handleImport` writes a `Payload` row
(`PayloadPersistType.TEMP`). Only `@preview` persists nothing.

The Validate tab was separately verified **through the real stack**, not just in isolation:
loading `/ginas/app/ui/sdf-tools`, clicking the validator's file input with a genuine mouse
event (the file chooser does open under the sandbox), supplying
`00_SampleSDF_MF012345_API_Name.sdf`, and confirming the SUCCESS report, four rendered
structures, the populated table and a downloaded
`00_SampleSDF_MF012345_API_Name_ValidationReport.txt` — with the scoped CSP in place and no
console errors from the frame.

## Companion changes in the `precision-fda` repo

This feature is not frontend-only. Four files in the sibling repo must ship with it, or the
hub is broken in ways that look like frontend bugs:

| File | Why | Symptom if missing |
| --- | --- | --- |
| `packages/gsrs/web/config/application.conf` | two malformed adapter keys stop the `SDF` adapter registering | `GET /import/adapters` returns `[]`; every upload fails with `Cannot predict settings with unknown import adapter` |
| `packages/gsrs/web/config/roles_config.json` | grants `Import Data` to `DataEntry` | upload and convert return 401 |
| `packages/gsrs/nginx/nginx.conf` | allowlists the three import endpoints, denies the destructive ones | without it the privilege grant would also expose `@execute` / `stagingArea` |
| `packages/rails/app/controllers/ginas_unauthorized_controller.rb` | scoped CSP override for the validator asset | validator renders but the file picker does nothing |

All four are deployment config or server policy; none of them changes GSRS application code.

## Outstanding verification

Submitting a reviewed record to My Home (`saveSubstance(record, 'import')`) has not been
exercised end to end. Substance creation is guarded only by `@PreAuthorize("isAuthenticated()")`,
not by a privilege, so it should work for guests and normal users alike — but confirm it, since
it is the linchpin of ticket 2's My Home flow.
