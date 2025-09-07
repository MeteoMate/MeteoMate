import os
from jinja2 import Environment, FileSystemLoader, StrictUndefined

print(os.environ)

# Load the Jinja2 template
env = Environment(loader=FileSystemLoader("."), undefined=StrictUndefined)
template = env.get_template("nginx.conf.j2")

# Render with all env vars
config = template.render(**os.environ)


# Write the final config
with open("nginx.conf", "w") as f:
    f.write(config)
