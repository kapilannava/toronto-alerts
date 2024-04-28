import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
  TextField,
  Chip,
  Autocomplete,
} from '@mui/material';

const ShootingsByEventID = () => {
  const [shootings, setShootings] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [sortField, setSortField] = useState('EVENT_UNIQUE_ID'); // Default sorting field
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order
  const [page, setPage] = useState(0); // Current page number
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  const fetchShootings = async (
    divisions,
    neighborhoods,
    years,
    sortField,
    sortOrder,
    page,
    rowsPerPage
  ) => {
    try {
      let whereClauses = [];
      if (divisions.length > 0) {
        whereClauses.push(`DIVISION IN (${divisions.map((d) => `'${d}'`).join(', ')})`);
      }
      if (neighborhoods.length > 0) {
        whereClauses.push(`NEIGHBOURHOOD_158 IN (${neighborhoods.map((n) => `'${n}'`).join(', ')})`);
      }
      if (years.length > 0) {
        whereClauses.push(`OCC_YEAR IN (${years.join(', ')})`);
      }

      const whereClause = whereClauses.length > 0 ? whereClauses.join(' AND ') : '1=1';

      const startRecord = page * rowsPerPage;
      const response = await axios.get(
        'https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Shooting_and_Firearm_Discharges_Open_Data/FeatureServer/0/query',
        {
          params: {
            where: whereClause,
            orderByFields: `${sortField} ${sortOrder}`,
            outFields: 'EVENT_UNIQUE_ID,OCC_DATE,DIVISION,NEIGHBOURHOOD_158,INJURIES,DEATH,OCC_YEAR',
            resultRecordCount: rowsPerPage,
            resultOffset: startRecord,
            f: 'json', // Return in JSON format
          },
        }
      );

      if (response.data && Array.isArray(response.data.features)) {
        const records = response.data.features.map((feature) => feature.attributes);
        setShootings(records);
      } else {
        setShootings([]);
        throw new Error('No data returned from the server.');
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchShootings(
      selectedDivisions,
      selectedNeighborhoods,
      selectedYears,
      sortField,
      sortOrder,
      page,
      rowsPerPage
    );
  }, [selectedDivisions, selectedNeighborhoods, selectedYears, sortField, sortOrder, page, rowsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc'); // Default to ascending when changing fields
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Return date in the local format without time
  };

  const divisions = ['D11', 'D12', 'D13', 'D14', 'D15', 'D31', 'D32', 'D33', 'D41', 'D42', 'D43', 'D51', 'D52', 'D53', 'D54', 'D55'];
  const years = Array.from({ length: 20 }, (_, i) => 2000 + i); // Example range of years
  const neighborhoods = [
    'Agincourt North',
    'Agincourt South-Malvern West',
    'Alderwood',
    'Annex',
    'Banbury-Don Mills',
    'Bathurst Manor',
    'Bay-Cloverhill',
    'Bayview Village',
    'Bayview Woods-Steeles',
    'Bedford Park-Nortown',
    'Beechborough-Greenbrook',
    'Bendale South',
    'Bendale-Glen Andrew',
    'Birchcliffe-Cliffside',
    'Black Creek',
    'Blake-Jones',
    'Briar Hill-Belgravia',
    'Bridle Path-Sunnybrook-York Mills',
    'Broadview North',
    'Brookhaven-Amesbury',
    'Cabbagetown-South St.James Town',
    'Caledonia-Fairbank',
    'Casa Loma',
    'Centennial Scarborough',
    'Church-Wellesley',
    'Clairlea-Birchmount',
    'Clanton Park',
    'Cliffcrest',
    'Corso Italia-Davenport',
    'Danforth',
    'Danforth East York',
    'Danforth East',
    'Don Valley Village',
    'Dorset Park',
    'Dovercourt Village',
    'Downsview',
    'Dufferin Grove',
    'East End-Danforth',
    'East L' + `'`+ 'Amoreaux',
    'East Willowdale',
    'Edenbridge-Humber Valley',
    'Eglinton East',
    'Elms-Old Rexdale',
    'Englemount-Lawrence',
    'Eringate-Centennial-West Deane',
    'Etobicoke City Centre',
    'Etobicoke West Mall',
    'Flemingdon Park',
    'Forest Hill North',
    'Forest Hill South',
    'Fort York-Liberty Village',
    'Glenfield-Jane Heights',
    'Golfdale-Cedarbrae-Woburn',
    'Greenwood-Coxwell',
    'Guildwood',
    'Harbourfront-CityPlace',
    'Henry Farm',
    'High Park North',
    'High Park-Swansea',
    'Highland Creek',
    'Hillcrest Village',
    'Humber Bay Shores',
    'Humber Heights-Westmount',
    'Humber Summit',
    'Humbermede',
    'Humewood-Cedarvale',
    'Ionview',
    'Islington',
    'Junction Area',
    'Junction-Wallace Emerson',
    'Keelesdale-Eglinton West',
    'Kennedy Park',
    'Kensington-Chinatown',
    'Kingsview Village-The Westway',
    'Kingsway South',
    'Lambton Baby Point',
    'Lansing-Westgate',
    'Lawrence Park North',
    'Lawrence Park South',
    'Leaside-Bennington',
    'Little Portugal',
    'Long Branch',
    'Malvern East',
    'Malvern West',
    'Maple Leaf',
    'Markland Wood',
    'Milliken',
    'Mimico-Queensway',
    'Morningside',
    'Morningside Heights',
    'Moss Park',
    'Mount Dennis',
    'Mount Olive-Silverstone-Jamestown',
    'Mount Pleasant East',
    'Mount Pleasant West',
    'New Toronto',
    'Newtonbrook East',
    'Newtonbrook West',
    'Niagara',
    'North Riverdale',
    'North St.James Town',
    'North Toronto',
    'North York University Heights',
    'NSA',
    'Oakridge',
    'Oakwood Village',
    'Old East York',
    'Palmerston-Little Italy',
    "Parkwoods-O'Connor Hills",
    'Pelmo Park-Humberlea',
    'Pleasant View',
    'Playter Estates-Danforth',
    'Princess-Rosethorn',
    'Regent Park',
    'Rexdale-Kipling',
    'Rockcliffe-Smythe',
    'Roncesvalles',
    'Rosedale-Moore Park',
    'Rouge',
    'Runnymede-Bloor West Village',
    'Rustic',
    'Scarborough Village',
    'South Eglinton-Davisville',
    'South Parkdale',
    'South Riverdale',
    'Steeles',
    'Stonegate-Queensway',
    "Tam O'Shanter-Sullivan",
    'Taylor-Massey',
    'The Beaches',
    'Thistletown-Beaumond Heights',
    'Thorncliffe Park',
    'Trinity-Bellwoods'
]; // Example neighborhood names

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px', marginBottom: '16px', paddingTop: '12px' }}>
        <Autocomplete
          label={"Division"}
          multiple
          options={divisions}
          getOptionLabel={(option) => option}
          value={selectedDivisions}
          onChange={(event, newValue) => setSelectedDivisions(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Divisions" variant="outlined" />}
          sx={{ flex: 1 }}
       />
        
        <Autocomplete
          multiple
          options={neighborhoods}
          getOptionLabel={(option) => option}
          value={selectedNeighborhoods}
          onChange={(event, newValue) => setSelectedNeighborhoods(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Neighborhoods" variant="outlined" />}
          sx={{ flex: 1 }}
       />

        <Autocomplete
          multiple
          options={years}
          getOptionLabel={(option) => option.toString()}
          value={selectedYears}
          onChange={(event, newValue) => setSelectedYears(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Years" variant="outlined" />}
          sx={{ flex: 1 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'EVENT_UNIQUE_ID'}
                  direction={sortOrder}
                  onClick={() => handleSort('EVENT_UNIQUE_ID')}
                >
                  Event ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'DIVISION'}
                  direction={sortOrder}
                  onClick={() => handleSort('DIVISION')}
                >
                  Division
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'OCC_DATE'}
                  direction={sortOrder}
                  onClick={() => handleSort('OCC_DATE')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'NEIGHBOURHOOD_158'}
                  direction={sortOrder}
                  onClick={() => handleSort('NEIGHBOURHOOD_158')}
                >
                  Neighborhood
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'INJURIES'}
                  direction={sortOrder}
                  onClick={() => handleSort('INJURIES')}
                >
                  Injuries
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'DEATH'}
                  direction={sortOrder}
                  onClick={() => handleSort('DEATH')}
                >
                  Deaths
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shootings.map((shooting) => (
              <TableRow key={shooting.EVENT_UNIQUE_ID}>
                <TableCell>{shooting.EVENT_UNIQUE_ID}</TableCell>
                <TableCell>{shooting.DIVISION}</TableCell>
                <TableCell>{formatDate(shooting.OCC_DATE)}</TableCell>
                <TableCell>{shooting.NEIGHBOURHOOD_158}</TableCell>
                <TableCell>{shooting.INJURIES || 0}</TableCell>
                <TableCell>{shooting.DEATH || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={2000} // Hard-coded max count; ideally, fetch from the server
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 50, 100]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ShootingsByEventID;
