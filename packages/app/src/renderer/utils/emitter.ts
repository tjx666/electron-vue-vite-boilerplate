import Emittery from 'emittery';

const emitter = new Emittery();
// Emittery.isDebugEnabled = import.meta.env.MODE === 'development';

export default emitter;
