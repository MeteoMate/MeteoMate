import os
import re
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, StrictUndefined

_META = r'.^$*+?{}[]|()\\'

def escape_regex_literal(s: str) -> str:
    """Escape only regex metacharacters so s is matched literally in PCRE."""
    return re.sub(r'([.\^\$\*\+\?\{\}\[\]\|\(\)\\])', r'\\\1', s)

def normalize_api_prefix(prefix: str) -> str:
    if not prefix:
        return "/"
    cleaned = prefix.strip().strip("/")
    return f"/{cleaned}/"

def load_environment() -> dict:
    env_vars = dict(os.environ)
    if "API_PREFIX" in env_vars:
        env_vars["API_PREFIX"] = normalize_api_prefix(env_vars["API_PREFIX"])
    return env_vars

def render_template(template_name: str, context: dict) -> str:
    env = Environment(loader=FileSystemLoader("."), undefined=StrictUndefined)
    # register the filter
    env.filters["re_lit"] = escape_regex_literal
    template = env.get_template(template_name)
    return template.render(**context)

def main():
    context = load_environment()
    config = render_template("nginx.conf.j2", context)
    Path("nginx.conf").write_text(config, encoding="utf-8")
    print("INFO: Nginx config rendered to nginx.conf")

if __name__ == "__main__":
    main()