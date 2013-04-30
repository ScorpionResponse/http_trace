EXTFILES = *.js *.html *.png manifest.json README*

all: create_build zip_it

create_build: 
	mkdir -p build/http_trace
	cp $(EXTFILES) build/http_trace/

zip_it: 
	cd build ; zip -r http_trace.zip http_trace

clean: 
	rm -r build
