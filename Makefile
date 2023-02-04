first_time_setup:
	python -m pip install --upgrade Pillow && pip3 install -r requirements.txt
	cd step2_spritesheet_to_generative_sheet && npm i && cd ..

step1:
	python step1_layers_to_spritesheet/build.py

step2:
	cd step2_spritesheet_to_generative_sheet && npm run generate && cd ..

step3:
	python step3_generative_sheet_to_output/build.py

step23:
	cd step2_spritesheet_to_generative_sheet && npm run generate && cd ..
	python step3_generative_sheet_to_output/build.py

step123:
	python step1_layers_to_spritesheet/build.py
	cd step2_spritesheet_to_generative_sheet && npm run generate && cd ..
	python step3_generative_sheet_to_output/build.py

all:
	python all.py

solana:
	cd step2_spritesheet_to_generative_sheet && npm run generate:solana && cd ..

tezos:
	cd step2_spritesheet_to_generative_sheet && npm run generate:tezos && cd ..
	python step3_generative_sheet_to_output/resize.py

provenance:
	cd step2_spritesheet_to_generative_sheet && node utils/provenance.js && cd ..


rarity:
	cd step2_spritesheet_to_generative_sheet && node utils/rarityData.js && cd ..

update_json:
	cd step2_spritesheet_to_generative_sheet && node utils/updateInfo.js && cd ..

update_json_tezos:
	cd step2_spritesheet_to_generative_sheet && npm run update_info:tezos && cd ..

all_batch:
	make all

replace:
	cd step2_spritesheet_to_generative_sheet && npm run replace ../ultraRares && cd ..

preview:
	python step3_generative_sheet_to_output/preview.py

regenerate:
	python regenerate.py

html:
	python generate_html/build.py
