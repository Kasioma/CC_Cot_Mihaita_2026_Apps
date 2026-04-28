import React, { useEffect, useMemo, useState } from "react";
import "./css/DataTable.css";

function DataTable({ dataResponse, loading }) {
  const [selectedDevice, setSelectedDevice] = useState("ALL");
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (!dataResponse?.data) return;

    const uniqueDevices = [...new Set(dataResponse.data.map((item) => item.device_id))];

    setDevices(uniqueDevices);
  }, [dataResponse]);

  const filteredData = useMemo(() => {
    if (!dataResponse?.data) return [];

    if (selectedDevice === "ALL") return dataResponse.data;

    return dataResponse.data.filter((item) => item.device_id === selectedDevice);
  }, [dataResponse, selectedDevice]);

  return (
    <section className="card card-wide">
      <div className="section-head">
        <h2>Energy Usage Data</h2>
        {dataResponse?.role && (
          <span>
            Role: <strong>{dataResponse.role}</strong>
          </span>
        )}
      </div>

      {dataResponse?.role === "admin" && (
        <div style={{ marginBottom: "12px" }}>
          <label>
            Filter by device:{" "}
            <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
              <option value="ALL">All devices</option>
              {devices.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {loading ? (
        <p className="muted">Loading data...</p>
      ) : filteredData.length ? (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Timestamp</th>
                <th>kWh</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.device_id}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>{item.kwh}</td>
                  <td>{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">No data available.</p>
      )}
    </section>
  );
}

export default DataTable;
