from pathlib import Path
from secrets import token_urlsafe
from base64 import urlsafe_b64encode
from os import urandom
p=Path(__file__).resolve().parent.parent/'.env'
if p.exists():
    print('Already present:',p)
else:
    p.write_text('POSTGRES_PASSWORD='+token_urlsafe(35)+'\nSESSION_SECRET='+token_urlsafe(48)+'\nINTEGRATION_KEY='+urlsafe_b64encode(urandom(32)).decode()+'\nWHATSAPP_INTERNAL_KEY='+token_urlsafe(32)+'\n')
    p.chmod(0o600)
    print('Created:',p)
