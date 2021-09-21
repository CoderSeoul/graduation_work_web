import React, { useState, useEffect, useMemo } from 'react';
import BasicGrid from './Components/grid';
import RequestApi from './Client';
import dayjs from 'dayjs';

function App() {
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState('DVC__000002');
  const [selectedIndexs, setSelectedIndexs] = useState([0]);
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

    RequestApi.get(`/api/v1/device-logs/${deviceId}`).then((res) => {
      console.log(res);
      const deviceHistory = res.content.map((item) => {
        let stringify = item.value;
        stringify = stringify.replaceAll('*', '"');
        return {
          recordedAt: item.recordedAt,
          value: JSON.parse(stringify),
        };
      });

      setSelectedItem(deviceHistory);
      convertFormat(deviceHistory);
    });
  }, []);

  const convertFormat = (deviceHistory) => {
    const convertedVoronoi = convertVoronoi(
      deviceHistory[selectedIndexs[0]].value.highRisk
    );
    const convertedClassCounter = convertClassCounter(
      deviceHistory[selectedIndexs[0]].value.classCounter
    );
    const convertedTableData = convertTableData(deviceHistory);
    console.log({ convertedVoronoi });
    console.log({ convertedVoronoi });
    console.log({ convertedClassCounter });
    setVoronoi(convertedVoronoi);
    setClassCounter(convertedClassCounter);
    setTableData(convertedTableData);
    setLoading(false);
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
      const tt = convertVoronoi(selectedItem[indexItem].value.highRisk);
      voronoi_assemble = [...voronoi_assemble, ...tt];
    });

    let classCounter_assemble;
    let classCounter_car_sum = 0;
    let classCounter_person_sum = 0;
    selectedIndexs.forEach((indexItem) => {
      const tt = convertClassCounter(
        selectedItem[indexItem].value.classCounter
      );
      const carIndex = tt.findIndex((obj) => obj.label == 'car');
      const personIndex = tt.findIndex((obj) => obj.label == 'person');

      classCounter_car_sum += tt[carIndex]?.value || 0;
      classCounter_person_sum += tt[personIndex]?.value || 0;
    });
    classCounter_assemble = {
      car: Math.round(classCounter_car_sum / selectedIndexs.length),
      person: Math.round(classCounter_person_sum / selectedIndexs.length),
    };

    let classCounterToSave = [...classCounter];
    const carIndex = classCounter.findIndex((obj) => obj.label == 'car');
    const personIndex = classCounter.findIndex((obj) => obj.label == 'person');

    if (carIndex !== -1)
      classCounterToSave[carIndex].value = classCounter_assemble.car;
    if (personIndex !== -1)
      classCounterToSave[personIndex].value = classCounter_assemble.person;

    console.log({ classCounter_assemble });
    console.log({ classCounterToSave });
    setVoronoi(voronoi_assemble);
    setClassCounter(classCounterToSave);
  }, [selectedIndexs]);

  return (
    <div
      style={{ backgroundColor: '#EBEDF1', width: '100vw', height: '100vh' }}
    >
      {loading ? (
        <div />
      ) : (
        <BasicGrid
          deviceId={deviceId}
          recordedAt={selectedItem[selectedIndexs[0]]?.recordedAt || 0}
          voronoi={voronoi}
          classCounter={classCounter}
          tableData={tableData}
          setSelectedIndexs={setSelectedIndexs}
          selectedIndexs={selectedIndexs}
        />
      )}
    </div>
  );
}

export default App;
