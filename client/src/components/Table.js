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
  Typography,
} from "@mui/material";

const HotelTable = ({ hotels = [], rowsPerPage, handleChangeRowsPerPage }) => {
  return (
    <Paper sx={{ width: "50%", margin: "0 auto" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hotel Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Website</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Rows per page</InputLabel>
        <Select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          label="Rows per page"
        >
          {[5, 10, 25, 50].map((rows) => (
            <MenuItem key={rows} value={rows}>
              {rows}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <Typography sx={{ m: 1 }}>
        {`Showing 1-${Math.min(rowsPerPage, hotels.length)} of ${
          hotels.length
        }`}
      </Typography> */}
    </Paper>
  );
};

export default HotelTable;
