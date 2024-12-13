import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const HotelTable = ({
  hotels = [],
  rowsPerPage,
  handleChangeRowsPerPage,
  onSave,
}) => {
  return (
    <Paper sx={{ width: "50%", margin: "0 auto" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hotel Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.slice(0, rowsPerPage).map((hotel) => (
              <TableRow key={hotel.hotel_id}>
                <TableCell>{hotel.hotel_name}</TableCell>
                <TableCell>{hotel.hotel_rating}</TableCell>
                <TableCell>
                  <Link
                    href={hotel.hotel_website_url}
                    target="_blank"
                    rel="noopener"
                  >
                    {hotel.hotel_website_url}
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onSave(hotel)}
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel>Number of Results</InputLabel>
        <Select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          label="Rows per page"
        >
          {[5, 10, 25, 50, 100].map((rows) => (
            <MenuItem key={rows} value={rows}>
              {rows}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default HotelTable;
