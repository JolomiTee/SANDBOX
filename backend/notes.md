# MY NOTES

Generate a random hex from cli:

1. run `node` then
2. `require(crypto).randomBytes(64).toString('hex')`
OR
run `openssl rand -base64 32`
These can be used to create access and refresh tokens
