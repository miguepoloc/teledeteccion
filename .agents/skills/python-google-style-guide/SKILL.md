---
description: Google Python Style Guide - Comprehensive Coding Rules
---

# Google Python Style Guide

You must ALWAYS adhere to the [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html) when writing or modifying Python code. This skill serves as your absolute source of truth for Python syntax, formatting, and conventions.

## 1. Imports (CRITICAL RULE)

**Never import individual classes, types, exceptions, or functions directly.**

- **Use `import x`** for importing packages and modules.
- **Use `from x import y`** where `x` is the package prefix and `y` is the **module name**.
- **Access members via module:** Always access classes/functions using the module name namespace (e.g., `module.ClassName`).

### 🚫 WRONG
```python
from pydantic import BaseModel, Field
from common.domain.entities.base_entity import BaseEntity
from typing import Optional, List, Dict
```

### ✅ CORRECT
```python
import pydantic
from common.domain.entities import base_entity
import typing

class MyEntity(base_entity.BaseEntity):
    name: str = pydantic.Field(...)
    items: typing.List[str]
```

*Exceptions to the import rule:* 
- `typing`, `collections.abc`, and `typing_extensions` can be used for static analysis.

* **Use Exceptions Over Error Codes:** Follow Pythonic exception handling instead of returning error codes.

### Logging Recommendations (Anti-Gravity Rules)

* **String Interpolation**: When using the standard `logging` module (e.g. `_LOGGER = logging.getLogger(__name__)`), ALWAYS use `%s` formatting for log messages instead of F-Strings or `.format()`.
  * **Incorrect**: `_LOGGER.info(f"User {user_id} logged in")`
  * **Correct**: `_LOGGER.info("User %s logged in", user_id)`
  * *Reasoning*: The `logging` module optimizes performance by only interpolating the string if the log level is active. Using an f-string forces evaluation at runtime regardless of the log level.

### DDD Serverless Architecture Constraints

* **1:1 Repository-to-Service Mapping**: A Domain Service class must **ONLY** interact with a single Repository. Injecting multiple different repositories into one service violates the Domain Driven Design principles for this project.
* **Orchestrator Pattern**: If a business flow requires interactions across multiple services (e.g., pulling user credentials and generating an auth token), create an **Orchestrator** function (inside `application/orchestrator/`). The router should depend on the orchestrator, and the orchestrator receives the necessary application services via dependency injection to coordinate the execution. Never couple domain services together directly.

---

## 2. Naming Conventions

Names must be descriptive and avoid ambiguous abbreviations.

- **Packages / Modules:** `lower_with_under` (e.g., `auth_service.py`)
- **Classes / Exceptions:** `CapWords` (PascalCase) (e.g., `ActiveSession`, `SessionNotFoundException`)
- **Functions / Methods:** `lower_with_under` (snake_case) (e.g., `calculate_totals()`)
- **Variables (Local/Instance):** `lower_with_under`
- **Constants:** `CAPS_WITH_UNDER` (e.g., `MAX_LOGIN_ATTEMPTS`)
- **Protected/Private:** Internal variables/methods should be prefixed with a single underscore `_` (e.g., `_handle_lockout()`).

*Avoid single-character names except for counters/iterators (`i`, `j`), exceptions (`e`), or file handles (`f`).*

---

## 3. Type Annotations

You are STRONGLY encouraged to use type annotations for all function/method arguments and return values.

- Use standard library types when possible: `list`, `dict`, `tuple` (Python 3.9+).
- Use `| None` instead of `Optional` (e.g., `device_os: str | None = None`).
- If a return type shouldn't be expressed, use `typing.Any`.
- Do not annotate `self` or `cls` unless returning `Self`.
- Do not annotate the return type for `__init__` (None is implied).

### Example
```python
def process_data(user_id: int, options: dict[str, typing.Any] | None = None) -> list[str]:
    pass
```

---

## 4. Docstrings and Comments

- **Triple Double Quotes:** Always use `"""` for docstrings.
- **Summary Line:** The first line must be a one-line summary (≤ 80 chars) ending with a period.
- **Descriptive/Imperative:** Use consistent style (`"""Fetches rows..."""` or `"""Fetch rows..."""`).
- **Module level:** Every file should start with a docstring describing its purpose.
- **Functions/Methods:** Mandatory for public APIs, non-trivial sizing, or obvious logic. Describe arguments (`Args:`), return values (`Returns:`), and exceptions (`Raises:`).

### Example
```python
def fetch_user(user_id: int) -> user_entity.User:
    """Fetches a user by their ID.

    Args:
        user_id: The unique identifier of the user.

    Returns:
        The User entity.

    Raises:
        UserNotFoundException: If the user does not exist.
    """
    pass
```

---

## 5. Formatting & Line Length

- **Line Length:** Maximum 80 characters per line. Exceptions for long URLs, import statements, or module-level strings.
- **Indentation:** Use 4 spaces per indentation level. NEVER use tabs.
- **Blank Lines:** 
  - 2 blank lines between top-level definitions (classes, functions).
  - 1 blank line between method definitions and inside functions to separate logical sections.
- **Parentheses:** Use parentheses sparingly. Do not use them in `return` statements or conditional statements unless necessary for line continuation.

Failure to follow these rules violates the Google Python Style Guide and is unacceptable.
