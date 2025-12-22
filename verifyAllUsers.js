// verifyAllUsers.js

const mongoose  = require("mongoose");
const User = require('./server/Model/User'); // Adjust path if needed (e.g., './server/Model/User')

// Your MongoDB connection string (same as in app.js)
const db = 'mongodb+srv://marcelpolocha1:081358pius@cluster0.f9a85hv.mongodb.net/masitrade';

async function verifyAllUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Update all users: set isVerified = true, clear verification fields
    const result = await User.updateMany(
      {}, // Empty filter = all documents
      {
        $set: {
          isVerified: true,
          verificationToken: null,
          verificationTokenExpires: null,
        },
      }
    );

    console.log(`Success! Updated ${result.modifiedCount} users.`);
    console.log(`${result.matchedCount} total users found in database.`);

    if (result.modifiedCount === 0) {
      console.log('No users were modified — they might already be verified.');
    }

  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

// Run the script
verifyAllUsers();