# Prometheus + Grafana Notes 

These notes are written in simple language so you can:
- Understand core monitoring concepts fast
- Explain them clearly in interviews
- Build confidence for DevOps/SRE/Cloud/Backend job roles

---

## 1) Why Monitoring Matters

In real jobs, systems fail for many reasons:
- CPU becomes high
- Memory leaks
- API becomes slow
- Database connections are full
- Disk is almost full

If you detect issues late, users face downtime and business loses money.

Monitoring helps you:
- Detect problems early
- Know exact root cause faster
- Reduce downtime
- Improve system performance


"Monitoring is not just graphs. It is the foundation for reliability, alerting, and faster incident response."

---

## 2) What is Prometheus?

Prometheus is an open-source monitoring and alerting tool.

Simple definition:
Prometheus collects metrics (numbers over time), stores them, and lets you query them using PromQL.

Examples of metrics:
- CPU usage
- Memory usage
- Request count
- Error count
- API latency

### Prometheus Core Components

1. Prometheus Server
- Main engine
- Scrapes metrics from targets
- Stores time-series data

2. Exporters
- Small tools that expose metrics from systems
- Example: Node Exporter for Linux server metrics

3. Service Discovery
- Finds targets automatically (Kubernetes, EC2, static configs)

4. TSDB (Time Series Database)
- Stores data as metric + timestamp + value + labels

5. Alertmanager
- Handles alerts from Prometheus
- Groups, deduplicates, and routes alerts (email, Slack, PagerDuty)

### Pull Model (Important)

Prometheus mostly uses pull model:
- Prometheus calls target endpoints like /metrics
- Target returns metric values


"Prometheus uses pull-based scraping, which gives centralized control and better target health visibility."

---

## 3) What is Grafana?

Grafana is a visualization and dashboard tool.

Simple definition:
Grafana reads data from data sources (Prometheus, Loki, Elasticsearch, etc.) and displays it as charts, dashboards, and panels.

You use Grafana to:
- Build dashboards
- Track system/application health
- Analyze trends
- Share dashboards with teams

### Grafana Key Features

1. Dashboards
- Group many panels in one view

2. Panels
- Graph, stat, gauge, table, heatmap

3. Variables
- Dynamic filters (server, environment, app)

4. Alerts (Grafana Alerting)
- Alert rules from panel queries

5. RBAC and folders
- Control who can view/edit dashboards


"Prometheus stores and queries metrics; Grafana makes those metrics actionable through dashboards and visual analysis."

---

## 4) Prometheus vs Grafana (Very Common Interview Question)

- Prometheus:
	- Collects metrics
	- Stores metrics
	- Query language: PromQL
	- Alerting through Alertmanager

- Grafana:
	- Visualizes data
	- Builds dashboards
	- Can query Prometheus and many other sources
	- Supports alerting and sharing

One-line answer:
"Prometheus is the data engine for metrics, Grafana is the visualization and dashboard layer on top of it."

---

## 5) Important Prometheus Concepts

### 5.1 Metric Types

1. Counter
- Always increases (or resets on restart)
- Example: total HTTP requests

2. Gauge
- Can go up/down
- Example: current memory usage

3. Histogram
- Measures distributions (like request duration)
- Supports bucket-based analysis and latency percentiles

4. Summary
- Similar to histogram but calculates quantiles client-side

### 5.2 Labels

Labels are key-value pairs for dimensions.
Example:
http_requests_total{method="GET", status="200", instance="10.0.0.5:9100"}

Why labels matter:
- Powerful filtering
- Grouping by app, env, region, status code

### 5.3 Scrape Interval and Evaluation Interval

- Scrape interval: how often Prometheus fetches metrics
- Evaluation interval: how often rules/alerts are evaluated

Tradeoff:
- Lower interval = more detail, more storage/load
- Higher interval = less detail, less cost

---

## 6) PromQL Basics (Must Know)

PromQL = Prometheus Query Language.

Useful examples:

1. Raw metric
node_cpu_seconds_total

2. Rate (requests/sec)
rate(http_requests_total[5m])

3. Error rate by service
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)

4. CPU usage (example style)
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

5. Memory usage percentage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100


"I use rate() for counters over time windows, sum by() for aggregation, and label filters for slicing metrics."

---

## 7) Alerting Flow (Prometheus + Alertmanager)

Flow:
1. Prometheus evaluates alert rule
2. If condition true for defined duration, alert fires
3. Alert sent to Alertmanager
4. Alertmanager routes to email/Slack/PagerDuty
5. On recovery, resolved notification sent

Important alert fields:
- severity (critical/warning)
- summary (short info)
- description (detail)
- runbook_url (what to do)


"Good alerts are actionable, low-noise, and include enough context for quick triage."

---

## 8) Grafana Dashboard Best Practices

1. Start with key SLI/SLO metrics
- Availability
- Latency
- Error rate
- Throughput

2. Use templating variables
- env, service, instance

3. Organize dashboard clearly
- Row 1: high-level health
- Row 2: resource metrics
- Row 3: application metrics
- Row 4: errors and logs links

4. Use right visualization
- Time-series for trends
- Stat for current value
- Heatmap for distribution

5. Add units and thresholds
- ms, %, req/s, bytes

---

## 9) Real-World Setup (What Companies Expect)

Typical production stack:
- Node Exporter (server metrics)
- cAdvisor/Kube-state-metrics (containers/K8s)
- App instrumentation (Java, Go, Python, Node)
- Prometheus server
- Alertmanager
- Grafana dashboards

Bonus tools you may hear:
- Loki (logs)
- Tempo/Jaeger (traces)
- OpenTelemetry (standardized telemetry)


"Metrics + logs + traces together give complete observability."

---

## 10) Common Interview Questions with Easy Answers

1. Why Prometheus pull model instead of push?
Answer: Pull gives central control, easy health checks, and target discovery. Push is useful for short-lived jobs via Pushgateway.

2. Counter vs Gauge?
Answer: Counter only increases (like total requests). Gauge can increase/decrease (like memory usage now).

3. What is `rate()`?
Answer: It calculates per-second average increase of a counter over a time range.

4. Why use labels?
Answer: Labels let us filter and group metrics by dimensions like service, instance, region, and status.

5. How do you reduce alert noise?
Answer: Use proper thresholds, `for` duration, grouping, deduplication, and severity-based routing.

6. What if Prometheus server goes down?
Answer: Use HA setup, persistent storage, backups, and remote write/long-term storage options.

---

## 11) Hands-On Practice Plan (7 Days)

Day 1:
- Install Prometheus + Node Exporter
- Scrape local machine metrics

Day 2:
- Install Grafana
- Add Prometheus as datasource
- Build first dashboard (CPU, memory, disk)

Day 3:
- Learn PromQL basics: rate, sum, avg, by, label filters

Day 4:
- Add simple app metrics (request count, latency)

Day 5:
- Create 3 alerts (high CPU, low disk, high 5xx)

Day 6:
- Integrate Alertmanager with email/Slack

Day 7:
- explain architecture and show dashboard

---


## 13) Quick Revision Cheat Sheet

- Prometheus = collect + store + query metrics
- Grafana = visualize + dashboard + analyze
- PromQL = query metrics over time
- Counter = only up
- Gauge = up/down
- Histogram = distribution and latency buckets
- Labels = dimensions for filtering/grouping
- Alertmanager = route and manage alerts
- Goal = fast detection + fast recovery + reliability

---

## 14) 60-Second Interview Pitch

"I use Prometheus for metrics collection and PromQL-based analysis, and Grafana for dashboards and alert visualization. I understand metric types, labels, scraping, and alert design with Alertmanager. I can build dashboards for CPU, memory, latency, errors, and throughput, and create actionable alerts with proper thresholds and routing. My focus is reducing incident response time and improving service reliability."

---

Use this document as your daily revision sheet before interviews.


For Monitoring there are two things: 

1. Metrics - To setup metrics we use prometheus. To setup we run prometheus client inside our server. This will collect our metrics. For this we have to install "prom-client". Prometheus is a monitoring tool for metrics. So now the /metrics will show the data but the data format is difficult to understand. So now we have to run the prometheus server on PORT: 9090. So this server will scrape the /metrics endpoint. So you will think how it scrape the metrics when we only write targets: ["192.168.1.216:8000"], because prometheus automatically write /metrics from its own. 
2. Better Visualization of metrics/logs  - For this we use grafana, we need to connect prometheus to grafana, also we can connect various stack eg - mongodb, postgresql. So first click on - Add your data source, then click on prometheus, then add the prometheus url so our prometheus server is running on : localhost:9090, but we cannot write localhost we have to use our IP address which is - 198.162.1x.xx: 9090. Then we have to create a new dashboard.

3. Logs - for logs collection we use grafana-loki. For this we have to push logs to the loki (3100 port). So for this we have to use winston-loki, and winston. Then copy paste the code from the documentation. And then add logs and restart server. Then in the grafana dashboard add data source which is loki. Then add a new visualization and in the label filter use level and then select info. Then after when you run query then all the info logs will appear

