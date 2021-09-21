import RequestApi from '../Client';

const getDeviceList = () => {
  return RequestApi.get('/api/v1/devices');
};
const getSpcfcDeviceDetail = (deviceid) => {
  return RequestApi.get(`/api/v1/devices/${deviceid}`);
};
const getDeviceLogs = () => {
  return RequestApi.get('/api/v1/device-logs?size=10');
};
const getSpcfcDeviceLogs = (deviceid) => {
  return RequestApi.get(`/api/v1/device-logs/${deviceid}`);
};
const postDeviceRegister = (body) => {
  return RequestApi.post('/api/v1/devices', body);
};
const postrRegisterDevicelog = () => {
  return RequestApi.post('/api/v1/device-logs');
};
export default {
  getDeviceList,
  getSpcfcDeviceDetail,
  getDeviceLogs,
  getSpcfcDeviceLogs,
  postDeviceRegister,
  postrRegisterDevicelog,
};
