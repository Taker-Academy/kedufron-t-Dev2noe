function save_basket(basket)
{
    localStorage.setItem("basket", JSON.stringify(basket));
}

function get_basket()
{
    let basket = localStorage.getItem("basket");

    if (basket == null) {
        return [];
    } else {
        return JSON.parse(basket)
    }
}

function add_basket(product)
{
    let basket = get_basket();
    let found_product = basket.find(p => p.id == product.id);

    if (found_product != undefined) {
        found_product.quantity++;
    } else {
        product.quantity = 1;
        basket.push(product);
    }
    save_basket(basket);
}

function remove_from_basket(product)
{
    let basket = get_basket();

    basket = basket.filtrer(p => p.id != product.id);
    save_basket(basket);
}

function change_quantity(product, quantity)
{
    let basket = get_basket();
    let found_product = basket.find(p => p.id == product.id);

    if (found_product != undefined) {
        found_product.quantity += quantity; 
    }
    save_basket(basket);
}