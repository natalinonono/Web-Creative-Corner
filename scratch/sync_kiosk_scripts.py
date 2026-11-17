import os

source_path = os.path.join("kiosk-scripts", "Startup_PC-05.bat")
with open(source_path, "r", encoding="utf-8") as f:
    template = f.read()

for pc_num in ["01", "02", "03", "04"]:
    target_id = f"PC-{pc_num}"
    content = template.replace("PC-05", target_id)
    target_path = os.path.join("kiosk-scripts", f"Startup_PC-{pc_num}.bat")
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {target_path}")
