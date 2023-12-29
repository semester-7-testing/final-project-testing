set -e

HOST=$1 # backend, frontend
PROFILE=$2 # normal, high, extreme

if [ $1 = "--help" ]; then
    echo "Usage: ./run.sh [host] [profile]"
    echo "  host:    [backend, frontend]"
    echo "  profile: [normal, high, extreme]"
    exit 0
fi

if [ ! "$HOST" = "backend" ] && [ ! "$HOST" = "frontend" ]; then
    echo "Invalid host: $HOST"
    exit 1
fi

if [ ! "$PROFILE" = "normal" ] && [ ! "$PROFILE" = "high" ] && [ ! "$PROFILE" = "extreme" ]; then
    echo "Invalid profile: $PROFILE"
    exit 1
fi

echo "Running k6 with $PROFILE load profile on $HOST"

docker run -it --rm \
    -v $(pwd):/scripts \
    -v $(pwd)/tmp:/work \
    -p 5665:5665 \
    -e HOST=$HOST \
    -e LOAD_PROFILE=$PROFILE \
    ghcr.io/grafana/xk6-dashboard:latest \
    run --out=dashboard=report=/work/report.html /scripts/script.js
