import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../firebase';

const Books = () => {


  const [listBooking, setListBooking] = useState([]);
  const [allBooking, setAllBooking] = useState([]);
  const [keyword, setKeyword] = useState(null);
  const [deleteItem, setDeleteItem] = useState(false);
  //lay danh sach chuyen di
  const fetchListBooking = async () => {
    try {
      let array = [];
      await database
        .ref('booking')
        .get()
        .then(query => {
          query.forEach(doc => {
            console.log(doc.val());
            const { statusBooking, timeStart, timeEnd, estimatedTime, tripCode, typeBooking, distance, nameDriver, name, date, payment, startAddress, endAddress } = doc.val();
            array.push({
              typeBooking: typeBooking === 0 ? 'Di bao xe' : 'Di ghep',
              statusBooking: statusBooking === 0 ? 'Da tim duoc tai xe'
                : (statusBooking === 1 ? 'Tren duong den' : (
                  statusBooking === 2 ? 'Hoan thanh' : (
                    statusBooking === 3 ? 'Tai xe huy chuyen' : (
                      statusBooking === 4 ? 'Dang tim tai xe' : (
                        statusBooking === 5 ? 'Hanh khach huy chuyen' : 'Admin xoa')
                    )
                  )
                )),
              distance,
              nameDriver:nameDriver? nameDriver : '',
              date,
              startAddress,
              endAddress,
              payment,
              name,
              id: tripCode,
              estimatedTime,
              timeStart,
              timeEnd
            })
          })
        });
      setListBooking(array);
      setAllBooking(array);
    } catch (e) {
      alert(e);
    }
  }
  //tim kiem
  const handleSearch = (e) => {
    const keyword = e.target.value;

    setListBooking(
    allBooking.filter(l => (
        l.name.toLowerCase().includes(keyword.toLowerCase())
        || l.nameDriver.toLowerCase().includes(keyword.toLowerCase())
        || l.typeBooking.toLowerCase().includes(keyword.toLowerCase())
        || l.date.toLowerCase().includes(keyword.toLowerCase())
        || l.statusBooking.toLowerCase().includes(keyword.toLowerCase())
      ))
      )

  }
  // loc
  const handleFilter = (e) => {
    const filter = e.target.value;
    setListBooking(
      allBooking.filter(l => (
        l.name.toLowerCase().includes(filter.toLowerCase())
        || l.nameDriver.toLowerCase().includes(filter.toLowerCase())
        || l.typeBooking.toLowerCase().includes(filter.toLowerCase())
        || l.date.toLowerCase().includes(filter.toLowerCase())
        || l.statusBooking.toLowerCase().includes(filter.toLowerCase())
      )))
  }
  const handleDelete = async (id) => {
    if (window.confirm('Ban co muon xoa?')) {
      await database.ref('booking/' + id)
        .update({
          statusBooking: 6
        })
        .then(() => {
          setDeleteItem(!deleteItem);
          alert('Xoa thanh cong!');
        })
    }
  }
  useEffect(() => {
    fetchListBooking();
  }, [deleteItem])
  return (
    <div className="wrapper">
      <div className="container-fluid">
        <br />
        <div className="row">
          <div className="col-12">
            <div className="card m-b-30">
              <div className="card-body">
                <div className="form-group row">
                  <h6 className="col-sm-5">DANH S??CH CHUY???N ??I</h6>
                  <div className="col-sm-4">
                    <input type="text" className="form-control" name="keyword" value={keyword} onChange={handleSearch} placeholder="Nh???p t??n t??i x???, kh??ch h??ng, tr???ng th??i ,.. ...." />
                  </div>
                  <div className="col-sm-3">
                    <select className="form-control" name="filter" onChange={handleFilter}>
                      <option>L???c theo</option>
                      <option value="hoan thanh">Chuy???n ??i ???? ho??n th??nh</option>
                      <option value="admin xoa">Chuy???n ??i ???? x??a</option>
                      <option value="dang tim tai xe">Chuy???n ??i ??ang t??m t??i x???</option>
                      <option value="tren duong den">Chuy???n ??i t??i x??? ??ang tr??n ???????ng ?????n</option>
                      <option value="tai xe huy chuyen">Chuy???n ??i t??i x??? h???y chuy???n</option>
                      <option value="dang tim tai xe">Chuy???n ??i ??ang t??m t??i x???</option>
                      <option value="hanh khach huy chuyen">Chuy???n ??i h??nh kh??ch h???y chuy???n</option>
                      <option value="di bao xe">D???ch v??? ??i bao xe</option>
                      <option value="di ghep">D???ch v??? ??i gh??p</option>
                    </select>
                  </div>
                </div>


                <table id="datatable" className="table table-bordered dt-responsive nowrap" style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
                  <thead>

                    <tr>
                      <th>Tr???ng th??i</th>
                      <th>D???ch v???</th>
                      <th>T??i x???</th>
                      <th>H??nh kh??ch</th>
                      <th>Th???i gian</th>
                      <th>Kho???ng c??ch</th>
                      <th>??i???m ??i</th>
                      <th>??i???m ????n</th>
                      <th>S??? ti???n</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      listBooking.map(booking => {
                        return (
                          <tr>
                            <td><span className="badge badge-primary">{booking.statusBooking}</span></td>
                            <td><span className="badge badge-warning">{booking.typeBooking}</span></td>
                            <td>{booking.nameDriver}</td>
                            <td>{booking.name}</td>
                            <td>{booking.date}</td>
                            <td>{booking.distance}</td>
                            <td>{booking.startAddress}</td>
                            <td>{booking.endAddress}</td>
                            <td>{booking.payment}</td>
                            <td>
                              <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                              }}>
                                <Link to={`/info/${booking.id}`} className="btn btn-primary" >Info</Link>
                                <Link onClick={() => handleDelete(booking.id)} className="btn btn-danger" >Delete</Link>
                              </div>

                            </td>
                          </tr>
                        )
                      })
                    }


                  </tbody>
                </table>
              </div>
            </div>
          </div> {/* end col */}
        </div> {/* end row */}
      </div>
      {/* end container-fluid */}
    </div>


  );
}


export default Books;