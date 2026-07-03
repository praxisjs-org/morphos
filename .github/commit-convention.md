## Git Commit Message Convention

> Adapted from [Vue.js's commit convention](https://github.com/vuejs/core/blob/main/.github/commit-convention.md), which itself is based on [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

#### TL;DR:

Messages must be matched by the following regex:

```regexp
/^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip)(\(.+\))?: .{1,50}/
```

#### Examples

Appears under "Features" header, `overlays` subheader:

```
feat(overlays): add support for nested popover anchoring
```

Appears under "Bug Fixes" header, `inputs` subheader, with a link to issue #12:

```
fix(inputs): restore focus to trigger on combobox close

close #12
```

Appears under "Performance Improvements" header, and under "Breaking Changes" with the breaking change explanation:

```
perf(core): memoize trapFocus tabbable-node lookup

BREAKING CHANGE: trapFocus now requires a container that is already mounted in the DOM.
```

The following commit and commit `667ecc1` do not appear in the changelog if they are under the same release. If not, the revert commit appears under the "Reverts" header.

```
revert: feat(overlays): add support for nested popover anchoring

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

### Full Message Format

A commit message consists of a **header**, **body** and **footer**. The header has a **type**, **scope** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Revert

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However, if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `docs`, `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `perf` | A performance improvement |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation only changes |
| `dx` | Developer experience improvements (tooling, scripts, configs) |
| `build` | Changes to the build system or external dependencies |
| `ci` | Changes to CI/CD configuration |
| `chore` | Other changes that don't modify src or test files |
| `style` | Changes that do not affect the meaning of the code (formatting) |
| `types` | Type-only changes |
| `wip` | Work in progress (not for merging into main) |

### Scope

The scope specifies the area of the codebase affected. Use the package name (without the
`@morphos/` prefix), or one of the private workspaces:

`core`, `inputs`, `overlays`, `layout`, `feedback`, `styles`, `docs`, `storybook`, `playground`

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "add" not "added" nor "adds"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then the breaking change description.
