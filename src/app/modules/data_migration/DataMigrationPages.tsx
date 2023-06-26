import { Route, Routes } from "react-router-dom";
import { MySQLCryptComponent } from "./component/mysql_crypt_config/MySQLCrypt";
import { DataSourceComponent } from "./component/data_source/DataSource";

const DataMigrationPage = () => {
  return (
    <Routes>
      <Route path="mysql-crypt" element={<MySQLCryptComponent />} />
      <Route path="data-sources" element={<DataSourceComponent />} />
    </Routes>
  );
};

export { DataMigrationPage };
