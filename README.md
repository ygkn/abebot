# abebot

Bot of [@averak](https://github.com/averak)

## Usage

Say message contains trigger word ("あべ", "アベ", "阿部", etc.), then **abebot** says
[@averak](https://github.com/averak)'s word.

Trigger word availabe in [triggers.txt](./triggers.txt), and
[@averak](https://github.com/averak)'s word availabe in [abe.txt](./abe.txt).

### Discord

Invite **abebot** with
[this link](https://discord.com/api/oauth2/authorize?client_id=902522751930224660&permissions=2048&scope=bot).

## Contribution

### Add abe word / trigger word

1. Fork this repository
2. Add new abe word / trigger word
3. Sort lines with `npm run sort-text` to avoid duplication
4. Commit and send PR!

### Enhance / fix program

1. Fork this repository
2. Fix program
3. Run `npm run code-check` and fix errors
4. Commit and send PR!
