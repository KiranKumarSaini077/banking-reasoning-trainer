# Data Schema

## Exercise
Required fields:
- `id`: deterministic string
- `prompt`: string
- `skills`: string[]
- `options`: array
- `correctAnswer`: value present in options

Recommended:
- `type`, `category`, `subcategory`
- `difficulty` 1-5
- `entities`
- `constraints`
- `explanation`
- `hints`
- `errorMap`
- `estimatedTime`
- `sourceType`
- `tags`

Malformed exercises are logged and filtered. A dataset with zero valid exercises produces a visible failure state.
