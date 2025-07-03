public class test {
    public  void count (String inVal) {
        String[] tmpArr = inVal.split("");
        HashMap<Integer, String> myCounter = new HashMap<>();

        for (String t: tmpArr) {
            if(!myCounter.contains(t)){
                myCounter.put(1, t);
            } else {
                int i = myCounter.get(t).cout();
                myCounter.put(++i, t);
            }
        }

        for(String t: myCounter.keySet()) {
            System.out.println("letter " + t + " has " + myCounter.get(t) + " occurences");
        }
    }
}