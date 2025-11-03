import React from "react";
import "./Admin.css";
import { FaPlaneDeparture, FaGlobeAsia, FaUsers, FaDollarSign, FaChartLine } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TravelStats = () => {
  const stats = [
    {
      title: "Total Travelers",
      value: "25,480",
      change: "+12.3% from last month",
      positive: true,
      icon: <FaUsers />,
    },
    {
      title: "Popular Destinations",
      value: "128",
      change: "+4 new places added",
      positive: true,
      icon: <FaGlobeAsia />,
    },
    {
      title: "Total Trips Booked",
      value: "7,592",
      change: "+2.1% this week",
      positive: true,
      icon: <FaPlaneDeparture />,
    },
    {
      title: "Total Revenue",
      value: "$540,000",
      change: "-3.2% drop from last month",
      positive: false,
      icon: <FaDollarSign />,
    },
  ];

  const data = [
    { month: "Jan", trips: 400, revenue: 30000 },
    { month: "Feb", trips: 480, revenue: 35000 },
    { month: "Mar", trips: 550, revenue: 40000 },
    { month: "Apr", trips: 650, revenue: 46000 },
    { month: "May", trips: 700, revenue: 50000 },
    { month: "Jun", trips: 850, revenue: 59000 },
  ];

  return (
    <div className="travel-dashboard">
      <h1 className="travel-dashboard-title">🌍 Travel Insights & Statistics</h1>
      <p className="travel-dashboard-subtitle">
        A quick snapshot of your travel business performance this season.
      </p>

      {/* Statistic Cards */}
      <div className="travel-stats-grid">
        {stats.map((stat, i) => (
          <div className="travel-card" key={i}>
            <div className="travel-icon">{stat.icon}</div>
            <h2>{stat.value}</h2>
            <p>{stat.title}</p>
            <span className={stat.positive ? "positive" : "negative"}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="travel-chart">
        <h2>
          <FaChartLine /> Monthly Trips & Revenue Trends
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" stroke="#555" />
            <YAxis yAxisId="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#16a34a" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                color: "#fff",
                borderRadius: "6px",
                border: "none",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Revenue ($)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trips"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Trips"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TravelStats;
