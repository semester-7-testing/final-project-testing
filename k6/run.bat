docker run -v %cd%:/scripts -p 5665:5665 -it --rm ghcr.io/grafana/xk6-dashboard:latest run --out=dashboard /scripts/script.js