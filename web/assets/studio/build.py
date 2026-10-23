import os
import subprocess

MODULES = [
    'core.js',
    'pages_overview.js',
    'pages_funnels.js',
    'pages_builder.js',
    'pages_contacts.js',
    'pages_bookings.js',
    'pages_whatsapp.js',
    'pages_inbox.js',
    'pages_automations.js',
    'pages_analytics.js',
    'pages_integrations.js',
    'pages_team.js',
    'pages_settings.js',
    'pages_docs.js',
    'modals.js',
    'events.js'
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STUDIO_JS = os.path.join(BASE_DIR, '..', 'studio.js')

parts = []
# 1. icons.js first (without the export keyword if needed, or stripping export)
with open(os.path.join(BASE_DIR, 'icons.js'), 'r') as f:
    icons_content = f.read().replace('export const icons=', 'const icons=')
    parts.append(icons_content)

for m in MODULES:
    fpath = os.path.join(BASE_DIR, m)
    if os.path.exists(fpath):
        with open(fpath, 'r') as f:
            parts.append(f.read())

bundle_content = '\n'.join(parts) + '\ninit();\n'

with open(STUDIO_JS, 'w') as f:
    f.write(bundle_content)

print(f"Generated {STUDIO_JS} successfully ({len(bundle_content)} chars)")

# Check syntax
res = subprocess.run(['node', '--check', STUDIO_JS], capture_output=True, text=True)
if res.returncode == 0:
    print("Syntax verification passed: node --check OK")
else:
    print("Syntax verification FAILED:")
    print(res.stderr)
    exit(1)

