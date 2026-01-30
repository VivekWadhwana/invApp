#!/bin/bash

# Port checker and auto-assignment script
check_port() {
    local port=$1
    if netstat -an | grep -q ":$port "; then
        return 1  # Port in use
    else
        return 0  # Port available
    fi
}

find_available_port() {
    local base_port=$1
    local port=$base_port
    
    while ! check_port $port; do
        port=$((port + 1))
        if [ $port -gt $((base_port + 100)) ]; then
            echo "Error: No available ports found in range $base_port-$((base_port + 100))"
            exit 1
        fi
    done
    
    echo $port
}

# Define base ports
FRONTEND_PORT=80
BACKEND_PORT=5000
MONGODB_PORT=27017
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
NODE_EXPORTER_PORT=9100
CADVISOR_PORT=8081

# Find available ports
FRONTEND_AVAILABLE=$(find_available_port $FRONTEND_PORT)
BACKEND_AVAILABLE=$(find_available_port $BACKEND_PORT)
MONGODB_AVAILABLE=$(find_available_port $MONGODB_PORT)
PROMETHEUS_AVAILABLE=$(find_available_port $PROMETHEUS_PORT)
GRAFANA_AVAILABLE=$(find_available_port $GRAFANA_PORT)
NODE_EXPORTER_AVAILABLE=$(find_available_port $NODE_EXPORTER_PORT)
CADVISOR_AVAILABLE=$(find_available_port $CADVISOR_PORT)

# Export as environment variables
export FRONTEND_PORT=$FRONTEND_AVAILABLE
export BACKEND_PORT=$BACKEND_AVAILABLE
export MONGODB_PORT=$MONGODB_AVAILABLE
export PROMETHEUS_PORT=$PROMETHEUS_AVAILABLE
export GRAFANA_PORT=$GRAFANA_AVAILABLE
export NODE_EXPORTER_PORT=$NODE_EXPORTER_AVAILABLE
export CADVISOR_PORT=$CADVISOR_AVAILABLE

echo "Available ports assigned:"
echo "Frontend: $FRONTEND_PORT"
echo "Backend: $BACKEND_PORT"
echo "MongoDB: $MONGODB_PORT"
echo "Prometheus: $PROMETHEUS_PORT"
echo "Grafana: $GRAFANA_PORT"
echo "Node Exporter: $NODE_EXPORTER_PORT"
echo "cAdvisor: $CADVISOR_PORT"