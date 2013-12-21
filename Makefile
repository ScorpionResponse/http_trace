EXTFILES = js css *.html icons manifest.json README*

all: clean create_build zip_it

create_build: 
	mkdir -p build/http_trace
	cp -r $(EXTFILES) build/http_trace/

zip_it: 
	cd build ; zip -r http_trace.zip http_trace

clean: 
	rm -f *~
	rm -f */*~
	rm -r build
