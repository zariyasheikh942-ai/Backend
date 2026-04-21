const express = require("express");
const dotenv = require("dotenv");
const Stripe = require('stripe');
const cors = require("cors");

dotenv.config();
const app = express();
// set up stripe 
const stripe =  new Stripe(process.env.STRIPE_SECRET_KEY);

// set up cors
app.use(cors({
    origin : process.env.CLIENT_URL
}));
 // POST request handle MIDDLEWARE
 app.use(express.json())

 // allow frontend origin 
 app.post('/create-checkout-session',async(req,res)=>{

    try{
const { product } = req.body ;
 const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image]
        },
        unit_amount: product.price * 100,
      },
      quantity: 1
    }
  ],
  mode: 'payment',
  success_url: `${process.env.CLIENT_URL}/success`,
  cancel_url: `${process.env.CLIENT_URL}/cancel`
});
 res.json({ url : session.url  })
}catch(error){
    res.status(500).json({error: error.message})
}
})


app.listen(4000,()=>{
    console.log("Server of backend is ruuning");
    
});
