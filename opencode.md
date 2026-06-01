# OpenCode Session Reference

Quick reference for resuming, listing, and managing OpenCode sessions.

## Continue a session

```bash
# Continue the most recent session
opencode -c
opencode --continue

# Continue a specific session
opencode -s <session-id>
opencode --session <session-id>

# Fork the session when continuing (starts a new branch from the existing one)
opencode -c --fork
opencode -s <session-id> --fork
```

The same flags work with `opencode run` for non-interactive use:

```bash
opencode run -c "follow-up question"
opencode run -s <session-id> "follow-up question"
```

## Find session IDs

```bash
opencode session list            # Tabular list
opencode session list -n 20      # Limit to 20 most recent
opencode session list --format json
```

## Manage sessions

```bash
opencode session delete <sessionID>
opencode stats                   # Token usage and cost per session
opencode stats --days 7          # Last 7 days only
```

## Export and import

```bash
# Export a session to JSON (omit ID to pick from a list)
opencode export [sessionID]
opencode export <sessionID> --sanitize   # Redact transcript/file data

# Import from a local file or an OpenCode share URL
opencode import session.json
opencode import https://opencode.ai/s/abc123
```

## Share a session

Inside the TUI, run `/share` to copy a shareable link to the clipboard. Or pass `--share` to `opencode run`.

To auto-share every session, set `OPENCODE_AUTO_SHARE=1`.

## Where sessions are stored

`~/.local/share/opencode/` on Linux/macOS. The exact path can be printed with `opencode db path`.

## Disable autocompaction (if a session keeps getting summarized)

```bash
OPENCODE_DISABLE_AUTOCOMPACT=1 opencode -c
```

## See also

- `opencode --help`
- https://opencode.ai/docs/cli/ — full CLI reference
- https://opencode.ai/docs/tui/ — TUI keybinds and commands
