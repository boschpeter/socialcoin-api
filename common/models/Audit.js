'use strict';

module.exports = function(Audit) {
  // Add extension code here

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  Audit.disableRemoteMethodByName('deleteById');
};
