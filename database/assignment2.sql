SELECT * FROM public.inventory
ORDER BY inv_id ASC;

SELECT * 
FROM public.inventory 
WHERE inv_year >= '2015' AND inv_year <= '2022';

SELECT inv_id, inv_make, inv_model, inv_price, inv_year 
FROM public.inventory 
WHERE inv_year >= '2015' AND inv_year <= '2022';

SELECT * FROM public.inventory
WHERE inv_id = 1;

SELECT * FROM public.inventory 
WHERE classification_id = 1;

UPDATE public.inventory 
SET inv_price = 100 
WHERE inv_id = 1;

SELECT * FROM public.inventory 
WHERE inv_price = 100;

DELETE FROM public.inventory
WHERE inv_id = 1;

INSERT INTO public.inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
VALUES   (
    'Chevy',
    'Camaro',
    '2018',
    'If you want to look cool this is the ar you need! This car has great performance at an affordable price. Own it today!',
    '/images/camaro.jpg',
    '/images/camaro-tn.jpg',
    25000,
    101222,
    'Silver',
    2);

	INSERT INTO public.account (account_first_name, account_last_name, account_email, account_password) VALUES 
	(
	'Tony', 
	'Stark', 
	'tony@starkent.com', 
	'Iam1ronM@n'
	);

	SELECT * FROM public.account
	ORDER BY account_id

	UPDATE public.account
	SET account_type = 'Admin'
	WHERE account_first_name = 'Tony' AND account_last_name = 'Stark';

	DELETE FROM public.account
	WHERE account_id = 1;


	UPDATE public.inventory
	SET inv_description = 'Do you have 6 kids and like to go offroading? The Hummer gives you a huge interiors with an engine to get you out of any muddy or rocky situation.'
	WHERE inv_id = 10;

	SELECT REPLACE(inv_description, 'a huge interiors', 'the small interiors') 
	FROM public.inventory 
	WHERE inv_id = 10;

	

	SELECT * FROM public.inventory
	WHERE inv_id = 10;

	SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

	
	