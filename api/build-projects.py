#!/usr/bin/env python3
"""Generate projects-fallback.json by scanning the Projects directory."""
import os, json

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Projects')
CATS = {'3d': '3D', 'design': 'Design', 'it': 'IT'}
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.webm'}
data = {}

for key, folder in CATS.items():
    target = os.path.join(BASE, folder)
    projects = []
    if os.path.isdir(target):
        for item in sorted(os.listdir(target)):
            item_path = os.path.join(target, item)
            if os.path.isdir(item_path):
                files = sorted([f for f in os.listdir(item_path)
                               if os.path.splitext(f)[1].lower() in EXTS])
                if files:
                    projects.append({'folder': item, 'files': files})
    data[key] = projects

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'projects-fallback.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(json.dumps(data, ensure_ascii=False, indent=2))
print(f'\nSaved to {out}')
