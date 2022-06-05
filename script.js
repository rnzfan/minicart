
/* fetch the data from the product API */
fetch("https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product")
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		return response.json();
	})
  .then(data => {
		displayProduct(data);
  })
  .catch((error) => console.error(`Could not fetch: ${error}`));

/* initialize variables */
let addedProducts = [];
let cartProductQty = 0;

/* After the page content has been loaded */
document.addEventListener('DOMContentLoaded', () => {
	document.getElementById("productQty").innerHTML = cartProductQty;

	/* Add event into the ADD TO CART button */
	const AddToCartButton = document.getElementById("addToCart");
	AddToCartButton.addEventListener("click", (event)=>{

		if (!document.getElementById("sizeChar").innerHTML) {
			alert("Please select a size!");
		} else {
			let productObject = {};
			productObject["imgURL"] = document.getElementById("mainImage").firstElementChild.src;
			productObject["title"] = document.getElementById("title").innerHTML;
			productObject["price"] = document.getElementById("price").innerHTML;
			productObject["selectedSize"] = document.getElementById("sizeChar").innerHTML;

			/* Update product qty */
			addedProducts.push(productObject);
			cartProductQty = addedProducts.length;
			document.getElementById("productQty").innerHTML = cartProductQty;
			productObject = {};

			/* Groups products by size */
			const groupBySize = addedProducts.reduce((group, product) => {
				const { selectedSize } = product;
				group[selectedSize] = group[selectedSize] ?? [];
				group[selectedSize].push(product);
				return group;
			}, {});

			/* Update product of the cart */
			updateCart(groupBySize);
			event.preventDefault();

			/* Automated Test */
			testCartLength(Object.keys(groupBySize).length);

		}
	});
});

/* main function to display the product */
function displayProduct(data) {
	
	/* Render product image */
	const imageURL = data["imageURL"];
	const productImg = document.createElement("img");
	productImg.src = imageURL;
	productImg.id = "productImage";
	document.getElementById("mainImage").appendChild(productImg);

	/* Render product title */
	const title = data["title"];
	document.getElementById("title").innerHTML = title;

	/* Render product description */
	const description = data["description"];
	document.getElementById("description").innerHTML = description;

	/* Render product price */
	const price = parseInt(data["price"]).toFixed(2);
	document.getElementById("price").innerHTML = price;

	/* Render Size and its options */
	const sizes = data["sizeOptions"];
	let selectedSize = "";
	for (const key in sizes) {
		const sizeButton = document.createElement("button");
		sizeButton.className = "btn";
		sizeButton.innerHTML = sizes[key].label;
		document.getElementById("sizeButtonGroup").appendChild(sizeButton);
	}

	const sizeButtons = document.querySelectorAll(".btn");
	sizeButtons.forEach(button => {
		button.addEventListener("click", ()=> {
			selectedSize = button.innerHTML;
			document.getElementById("sizeChar").innerHTML = selectedSize;
		})
	});
}

/* Add product into the cart */
function updateCart(groupedProducts) {
	let table = document.getElementById("tableDetails");
	table.innerHTML = "";
	for (const size in groupedProducts) {
		let productArray = groupedProducts[size];
		let row = document.createElement("tr");
		row.innerHTML =
		`
		<td><img src=${productArray[0].imgURL} id="CartImage"></td>
		<td id="CartDetails">${productArray[0].title}<br>
		${productArray.length}x <b>$${productArray[0].price}</b><br>
		Size: ${size}</td>
		`
		table.appendChild(row);
	}
}

/* An automated function to check the inconsistency between the added products and the actual products stored in the Cart */
function testCartLength(qty) {
	const qtyTypesOfAddedProducts = qty;
	const currentCartLength = document.getElementById("tableDetails").childElementCount;

	if (qtyTypesOfAddedProducts != currentCartLength) {
		console.log(`The qty (${qtyTypesOfAddedProducts}) of types of added products was inconsistent with the length (${currentCartLength}) of the current Cart!`);
	};
}

