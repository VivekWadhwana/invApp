# 📊 Monitoring Setup Guide

## Overview
Your app now includes **Prometheus + Grafana** for real-time monitoring, metrics collection, and visualization.

---

## 🚀 Services

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Frontend** | 3000 | http://localhost:3000 | Your app |
| **Prometheus** | 9090 | http://localhost:9090 | Metrics database |
| **Grafana** | 3001 | http://localhost:3001 | Dashboards & visualization |

---

## 🔑 Grafana Login

**Default Credentials:**
- **Username:** `admin`
- **Password:** `admin`

⚠️ **Change password on first login** (for security)

---

## 📈 Setting Up Grafana Dashboards

### Step 1: Add Prometheus Data Source
1. Open Grafana: http://localhost:3001
2. Login with credentials above
3. Go: **Configuration (gear icon) → Data Sources**
4. Click **Add data source**
5. Select **Prometheus**
6. URL: `http://prometheus:9090`
7. Click **Save & Test**

### Step 2: Create a Dashboard
1. Click **+** icon → **Dashboard**
2. Click **Add new panel**
3. Query section → Select **Prometheus**
4. Write a query like:
   ```
   up{job="prometheus"}
   ```
5. Click **Run query**
6. Customize title/visualization
7. Save dashboard

---

## 📊 Common Metrics to Monitor

```promql
# Container CPU usage
rate(container_cpu_usage_seconds_total[5m])

# Container memory usage
container_memory_usage_bytes

# Docker daemon status
up{job="docker"}

# System uptime
node_boot_time_seconds
```

---

## 🔧 Docker Compose Volumes

**Persistent data storage:**
- `prometheus_data` - Metrics history
- `grafana_data` - Dashboards & settings

Data persists even if containers restart.

---

## 📋 Prometheus Targets

Check Prometheus **Status → Targets**: http://localhost:9090/targets

You'll see:
- ✅ Prometheus itself
- ⚠️ Docker metrics (optional)
- ⚠️ Node Exporter (optional)

---

## 🚨 Alerts (Optional)

To enable alerting:
1. Create alert rules in `prometheus.yml`
2. Configure Alertmanager
3. Set webhook for Slack/email notifications

---

## 📱 Quick Start

### Deploy with monitoring:
```bash
docker compose up -d
```

### Access monitoring:
- **Grafana:** http://localhost:3001 (admin/admin)
- **Prometheus:** http://localhost:9090

### View container logs:
```bash
docker logs inventory-prometheus
docker logs inventory-grafana
```

### Stop all services:
```bash
docker compose down
```

---

## 🎯 Next Steps

1. ✅ Deploy app with Jenkins
2. ✅ Access Grafana dashboard
3. ✅ Add Prometheus data source
4. ✅ Create custom dashboards
5. ✅ Monitor app metrics in real-time

---

## 💡 Pro Tips

- **Save dashboards** after creating them
- **Create alerts** for critical metrics
- **Export dashboards** as JSON for backup
- **Use templating** for multi-environment monitoring

---

**Your app is now production-ready with full monitoring! 🚀📊**
