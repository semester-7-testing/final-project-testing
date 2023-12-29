docker run -it --rm \
    -v $(pwd):/scripts \
    -v $(pwd)/tmp:/work \
    -p 5665:5665 \
    ghcr.io/grafana/xk6-dashboard:latest \
    run --out=dashboard=report=/work/report.html /scripts/script.js
