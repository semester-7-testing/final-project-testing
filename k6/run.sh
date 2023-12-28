# Headless
# docker run --rm -i \
#     -v $(pwd)/output:/output \
#     grafana/k6 run - <scripts/script.js --out json=/output/test.json

# Linux
docker run -it --rm \
    -v $(pwd):/scripts \
    -p 5665:5665 \
    ghcr.io/grafana/xk6-dashboard:latest run --out=dashboard /scripts/script.js

# Windows
# docker run -v %cd%:/scripts -p 5665:5665 -it --rm ghcr.io/grafana/xk6-dashboard:latest run --out=dashboard /scripts/script.js