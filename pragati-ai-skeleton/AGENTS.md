# Pragati AI — AI Coding Rules

## Product
Pragati AI predicts infrastructure project cost overruns, schedule delays and implementation risks, then provides early warnings and decision support.

## Rules
1. Never modify unrelated files.
2. Make small, focused changes.
3. Do not delete working functionality without explicit approval.
4. Keep frontend, backend, ML and database concerns separated.
5. Never hardcode production data.
6. Keep secrets in environment variables.
7. Never expose API keys in frontend code.
8. Use TypeScript types for API data.
9. Use Pydantic schemas for FastAPI contracts.
10. Keep ML models separate from API routes.
11. Prefer reusable components and services.
12. Run tests/lint/type checks after meaningful changes.
13. Explain large architectural changes before implementing them.

## Vibe Coding Protocol
For each task:
- Inspect existing code.
- Identify files to change.
- State a short implementation plan.
- Make the smallest required change.
- Test it.
- Report what changed and any remaining issues.
