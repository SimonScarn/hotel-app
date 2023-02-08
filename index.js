const express = require("express");
const mongoose = require('mongoose');


const reservationSchema = new mongoose.Schema({
  client_id: Number,
  people: Number,
  room: Number,
  dateStart: String,
  dateEnd: String
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);


const userSchema = new mongoose.Schema({
  password: String,
  login: String,
  firstName: String,
  lastName: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.set('strictQuery', false);


mongoose.connect('mongodb+srv://testboah:testboah123@cluster2point0.hnnbl.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to DB');
    app.listen(8000, () => {
      console.log('server is runnin')
    })
  })
  .catch(err => console.log(err));


app.get('/reservations/get', async (req, res) => {
  Reservation.find({}).then((data) => {
    res.status(200).send(data);
  })
});

app.get('/reservations/get/:id', async (req, res) => {
  const reserv = await Reservation.findOne({_id: req.params.id});
  res.status(200).send(reserv); 
});

app.get('/reservations/get/sort/:value', async (req, res) => {
  console.log('hjuujihhujhuuhhuj', req.params.value)
  let reservations;
  switch(req.params.value) {
    case 'client-asc':
      break;
    case 'client-desc':
      break;
    case 'created-desc':
      reservations = await Reservation.find().sort({createdAt: -1});
      res.status(200).send(reservations); 
      break;
    case 'created-asc':
      reservations = await Reservation.find().sort({createdAt: 1});
      res.status(200).send(reservations); 
      break;
    default: 
      break;
  }
});


app.post('/reservations/create', async (req, res) => {
  console.log('hahahah')
  const reservation = new Reservation ({
    client_id: req.body.client_id,
    people: req.body.people,
    room: req.body.room,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
   
  });
  console.log(reservation);
  await reservation.save();
  res.send(reservation);
});



app.delete('/reservations/delete/:id', async (req, res) => {
  console.log(req.params)
  await Reservation.deleteOne({_id: req.params.id});
  res.status(200);
})

app.put('/reservations/update/:id', async (req, res) => {
  console.log('updatin ', req.body.room);

  await Reservation.updateOne({_id: req.params.id}, {
    room: req.body.room
  })
  res.status(200);
})


app.post('/register', async (req, res) => {
  console.log('posssssssss')

  const user = new User ({
    clientId: req.body.clientId,
    login: req.body.login,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
   
  });
  console.log(user);
  await user.save();
  res.send(user);
})



