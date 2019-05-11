import {object} from 'prop-types';
import React from 'react';
import Class from './Class.js';
import Func from './Func.js';

function Module({module}) {
  return (
    <div>
      <hr />
      <h2>{module.id}</h2>
      {module.classes.map(cls => (
        <Class key={cls.name} cls={cls} module={module} />
      ))}
      {module.functions.map(func => (
        <Func key={func.name} func={func} module={module} />
      ))}
    </div>
  );
}

Module.propTypes = {
  module: object.isRequired
};

export default Module;
