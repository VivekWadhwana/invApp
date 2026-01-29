
Auth folder
1.login -> fetch data(username/email and pass) -> confirm role (admin ? admin : employee) -> Dashboard
2.signup -> Name,userName,email,phoneNo,pass,confirmPass ->push data (userid = userName + last 5 digits of phoneNo) -> login

Dashboard folder
1.adminDash -> nav + pages + footer
2.employeedash -> nav + pages + footer

Pages folder
1.Home
2.Products -> const Products catalog -> navigate AddProduct + auto add product details
3.inventory -> on add Product it fetch data and deletes the data too
4.history -> only pushes inventory added data
5.Admin page
6.AddProduct -> on pushes data into inventory and clears all form inputs again

Nav Folder
1.adminNav
2.employee nav

Footer folder
1.footer

context folder
1.dataContext



//