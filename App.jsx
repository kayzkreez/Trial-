
import { useEffect, useState } from "react";
import { Card, CardContent } from "react";
import { Button } from "react";
import { Input } from "react";
import { Textarea } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MulaWavePlatform() {
  const [amount, setAmount] = useState(0);
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  const API_URL = "https://your-backend-api.com";

  const handleLogin = async (email, pin) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pin }),
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
  };

  const handleCreateOrder = async () => {
    const fee = 0.04 * amount;
    const rate = 87.5;
    const received = (amount - fee) * rate;
    const orderData = {
      amount: amount.toFixed(2),
      fee: fee.toFixed(2),
      received: received.toFixed(2),
      userId: user.id,
    };
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    setOrder(data);
    setOrders([data, ...orders]);
  };

  const fetchOrders = async () => {
    if (!user) return;
    const res = await fetch(`${API_URL}/orders?userId=${user.id}`);
    const data = await res.json();
    setOrders(data);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Mula Wave Order History", 14, 16);
    autoTable(doc, {
      head: [["Order #", "Amount", "Fee", "Received", "Date"]],
      body: orders.map((o) => [o.orderNum, `$${o.amount}`, `$${o.fee}`, `₹${o.received}`, o.date]),
    });
    doc.save("orders.pdf");
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <div className="grid gap-4 p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Mula Wave – Bridging the Financial Gap</h1>

      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardContent className="grid gap-2 py-4">
              <h2 className="text-xl font-semibold">User Login</h2>
              <Input placeholder="Email" id="email" />
              <Input type="password" placeholder="PIN" id="pin" />
              <Button onClick={() => handleLogin(document.getElementById("email").value, document.getElementById("pin").value)}>Login</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardContent className="grid gap-2 py-4">
              <h2 className="text-xl font-semibold">Create Transfer Order</h2>
              <Input
                type="number"
                placeholder="Amount in USD"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
              <Button onClick={handleCreateOrder}>Calculate & Generate Order</Button>
              {order && (
                <div className="mt-4 text-sm">
                  <p><strong>Order Number:</strong> {order.orderNum}</p>
                  <p><strong>Service Fee (4%):</strong> ${order.fee}</p>
                  <p><strong>Amount You Will Receive:</strong> ₹{order.received}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardContent className="grid gap-2 py-4">
              <h2 className="text-xl font-semibold">Register for Mula Wave</h2>
              <Input placeholder="Full Name" />
              <Input placeholder="Passport Number" />
              <Input placeholder="Email Address" />
              <Input placeholder="Phone Number" />
              <Input type="file" accept="image/*" />
              <Input placeholder="Preferred INR Account/Mobile Wallet" />
              <Input type="password" placeholder="Create PIN" />
              <Button>Register Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardContent className="grid gap-2 py-4">
              <h2 className="text-xl font-semibold">Customer Support</h2>
              <Textarea placeholder="Describe your issue here..." />
              <Button>Submit Support Request</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardContent className="grid gap-2 py-4">
              <h2 className="text-xl font-semibold">Admin Dashboard – Track Orders</h2>
              <Button onClick={exportToPDF} className="mb-2 w-fit">Export to PDF</Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Amount (USD)</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Received (INR)</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o, i) => (
                    <TableRow key={i}>
                      <TableCell>{o.orderNum}</TableCell>
                      <TableCell>${o.amount}</TableCell>
                      <TableCell>${o.fee}</TableCell>
                      <TableCell>₹{o.received}</TableCell>
                      <TableCell>{o.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm mt-6">
        <p className="font-medium">We are bridging the financial gap and peeling off the transaction burden, connecting global minds all in one wave.</p>
      </div>
    </div>
  );
}
    