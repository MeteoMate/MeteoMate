import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader, StrictUndefined


def normalize_api_prefix(prefix: str) -> str:
    """
    Ensure API_PREFIX always:
      - starts with a single leading slash
      - ends with a single trailing slash
      - has no duplicate slashes inside
    """
    if not prefix:
        return "/"

    # Strip leading/trailing whitespace and slashes
    cleaned = prefix.strip().strip("/")
    return f"/{cleaned}/"


def load_environment() -> dict:
    """Load environment variables and apply normalizations."""
    env_vars = dict(os.environ)

    # Normalize API_PREFIX if present
    if "API_PREFIX" in env_vars:
        env_vars["API_PREFIX"] = normalize_api_prefix(env_vars["API_PREFIX"])

    return env_vars


def render_template(template_name: str, context: dict) -> str:
    """Render the Jinja2 template with the given context."""
    env = Environment(loader=FileSystemLoader("."), undefined=StrictUndefined)
    template = env.get_template(template_name)
    return template.render(**context)


def main():
    context = load_environment()

    config = render_template("nginx.conf.j2", context)

    output_path = Path("nginx.conf")
    output_path.write_text(config, encoding="utf-8")

    print(f"INFO: Nginx config rendered to {output_path}")


if __name__ == "__main__":
    main()
