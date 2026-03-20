# Log Module: Data Flow (Taste Design)

The Log module is a "projection engine" that transforms raw Git history into task-oriented views. It follows a unidirectional flow to ensure "Predictable Taste."

## 1. The Stream (Source)
- **Input**: `git log` command execution (via Rust/NAPI).
- **Format**: Custom `--format` strings providing SHA, Parent SHAs, Author, Email, Date, and Subject.
- **Ownership**: `effects.ts` (Execution) -> `native/git/repository.rs` (Raw Command).

## 2. The Projection Engine (The Brain)
- **Input**: Raw `CommitRecord` stream.
- **Process**:
    - **Filter**: Drop records that don't match the current projection filter.
    - **Graph Construction**: On-the-fly calculation of branch lanes and merge points.
    - **Context Awareness**: Identifying "Upstream Drift" by comparing `feature/child` vs `dev/parent`.
- **Ownership**: `native/features/log/projection.rs` (High-performance computation).

## 3. The State Mapper (Domain Model)
- **Input**: Projected commit data.
- **Output**: `LogRow[]` collection.
- **Rule**: This layer is 100% pure. Every row has a stable ID (SHA) and pre-calculated lane metadata.
- **Ownership**: `features/log/engine.ts`.

## 4. The Presenter (View Shaping)
- **Input**: `LogRow` domain model.
- **Output**: `TuiLogRow` view model.
- **Process**: 
    - Map SHA to hex color.
    - Map lane numbers to Unicode symbols (│, ├, ┌).
    - Format dates and author signatures.
- **Ownership**: `features/log/presenter.ts`.

## 5. The Component Layer (Renderer)
- **Input**: `TuiLogRow`.
- **Output**: Ink/Terminal output.
- **Rule**: Zero logic in JSX. The component just renders props from the presenter.
- **Ownership**: `components/views/LogView.tsx`.

---

## USP Implementation: "History Mutation" Flow
1. **User Action**: "Edit Identity" on `row_1`.
2. **Facade**: `log.mutate.updateIdentity(sha, { name, email })`.
3. **Effect**: `git commit --amend --author="..."` or `git filter-repo` logic.
4. **Invalidation**: The engine detects the change, triggers a fresh projection stream, and updates the `LogState`.
