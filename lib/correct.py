from re import split;
from dill import load

def normalizeQuery(query , minScore , model) :
	#query = query.lower();
	def separate(words) :
		if len(words) == 0 : return ([],[]);
		quoted = []
		nonQuoted = []
		for word in words : 
			if word.startswith('"') : quoted.append(word);
			else : nonQuoted.append(word) 
		return (nonQuoted , quoted)

	if query.replace(" ","") == "" : return ([],[]);
	words = list(filter(lambda w : len(w.replace(" ","")) > 1 , split("""("[^"]*"|[A-Za-z01-9%\'?']+)+""" , query.strip())  ));

	if words == [] : return ([],[]);
	(words , quoted) = separate(words);
	if len(quoted) > 1 : return ([],[]);

	fixed = [];
	for word in words :
		r = model.get(word);
		if r != None : 
			(score , most) = r[0];
			if score >= minScore : fixed.append(most.lower());

	# print(fixed , quoted)
	return (fixed , quoted);


# print(normalizeQuery(' dolder '  , 0.65 , load(open("../data/models/correction.bin","rb"))));
