default:
  just --list

serve:
  python3 -m http.server

test:
  deno test
