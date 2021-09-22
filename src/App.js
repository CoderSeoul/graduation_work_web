import React, { useState, useEffect, useMemo } from 'react';
import BasicGrid from './Components/grid';
import RequestApi from './Client';
import dayjs from 'dayjs';

let exDeviceId = 'DVC__000002';
function App() {
  const [loading, setLoading] = useState(true);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceId, setDeviceId] = useState('DVC__000002');
  const [selectedIndexs, setSelectedIndexs] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [voronoi, setVoronoi] = useState([]);
  const [classCounter, setClassCounter] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    RequestApi.post('/api/v1/authentication', {
      username: 'test',
      password: 'test',
    }).then((res) => {
      window.localStorage.setItem('token', res);
    });

    RequestApi.get(`/api/v1/devices`).then((res) => {
      setDeviceList(res.content);
    });

    RequestApi.get(`/api/v1/device-logs/${deviceId}?size=100`).then((res) => {
      if (res.totalElements > 0) {
        exDeviceId = deviceId;
        const deviceHistory = res.content.map((item) => {
          let stringify = item.value;
          stringify = stringify.replaceAll('*', '"');
          let date = item.recordedAt.replace(
            /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
            '$1-$2-$3 $4:$5:$6'
          );

          return {
            recordedAt: date,
            value: JSON.parse(stringify),
          };
        });
        console.log({ deviceHistory });
        setSelectedItem(deviceHistory);
        convertFormat(deviceHistory);
        setLoading(false);
      } else {
        alert('no data!');
        setDeviceId(exDeviceId);
      }
    });
  }, [deviceId]);

  const convertFormat = (deviceHistory) => {
    const convertedVoronoi = convertVoronoi(deviceHistory[0].value.highRisk);
    const convertedClassCounter = convertClassCounter(
      deviceHistory[0].value.classCounter
    );
    const convertedTableData = convertTableData(deviceHistory);
    console.log({ convertedVoronoi });
    console.log({ convertedVoronoi });
    console.log({ convertedClassCounter });
    setVoronoi(convertedVoronoi);
    setClassCounter(convertedClassCounter);
    setTableData(convertedTableData);
  };

  const convertVoronoi = (list) => {
    let assemble = [];
    list.forEach((item) => {
      item.forEach((atom) => {
        atom['car'].id = Math.random().toString(36).substr(2, 11);
        atom['person'].id = Math.random().toString(36).substr(2, 11);
        assemble.push(atom['car']);
        assemble.push(atom['person']);
      });
    });
    return assemble;
  };

  const convertClassCounter = (list) => {
    let assemble = [];
    Object.keys(list).map((key, index) => {
      assemble.push({
        id: key,
        label: key,
        value: Math.round(list[key]),
      });
    });
    console.log(assemble);
    return assemble;
  };

  const convertTableData = (list) => {
    const assemble = list.map((item) => {
      const recordedAt = item.recordedAt;
      const car = Math.round(item.value.classCounter.car) || 0;
      const person = Math.round(item.value.classCounter.person) || 0;
      const highRisk = item.value.highRisk.length;

      return {
        recordedAt,
        car,
        person,
        highRisk,
      };
    });
    return assemble;
  };

  useEffect(() => {
    if (loading) return;
    let voronoi_assemble = [];
    selectedIndexs.forEach((indexItem) => {
      const index = selectedItem.findIndex((x) => x.recordedAt === indexItem);
      const tt = convertVoronoi(selectedItem[index].value.highRisk);
      voronoi_assemble = [...voronoi_assemble, ...tt];
    });

    let classCounterToSave = [];

    selectedIndexs.forEach((indexItem) => {
      const index = selectedItem.findIndex((x) => x.recordedAt === indexItem);
      const tt = convertClassCounter(selectedItem[index].value.classCounter);
      tt.forEach((ttitem) => {
        const findIndex = classCounterToSave.findIndex(
          (obj) => obj.label == ttitem.label
        );
        if (findIndex == -1) {
          classCounterToSave.push(ttitem);
        } else {
          classCounterToSave[findIndex].value += ttitem.value;
        }
      });
    });
    classCounterToSave.map((item) => {
      return (item.value = Math.ceil(item.value / selectedIndexs.length));
    });
    setVoronoi(voronoi_assemble);
    setClassCounter(classCounterToSave);
  }, [selectedIndexs]);

  return (
    <div
      style={{ backgroundColor: '#EBEDF1', width: '100vw', height: '100vh' }}
    >
      {loading ? (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src="loading.gif" alt="loading" />
        </div>
      ) : (
        <BasicGrid
          deviceList={deviceList}
          deviceId={deviceId}
          recordedAt={selectedItem[selectedIndexs[0]]?.recordedAt || 0}
          voronoi={voronoi}
          classCounter={classCounter}
          tableData={tableData}
          setSelectedIndexs={setSelectedIndexs}
          selectedIndexs={selectedIndexs}
          setDeviceId={setDeviceId}
        />
      )}
    </div>
  );
}

export default App;
