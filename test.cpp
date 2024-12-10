#include <iostream>
using namespace std;

int printPattern()
{
    int i, j;
    for (i = 1; i <= 15; i++)
    {
        for (j = 1; j <= i; j++)
        {
            cout << "*";
        }
        cout << endl;
    }
    // cout<<"*"<<endl;
    return 0;
}

int main()
{

    printPattern();
    return 0;
    int a = 10;
    int b = 5;
    int x, y, sum, difference;
    float division;
    int product = a * b;
    cout << "The product of " << a << " and " << b << " is " << product << endl;
    cout << "Please enter First number of your own chioce " << endl;
    cin >> x;
    cout << "Please enter Second number of your own chioce " << endl;
    cin >> y;
    product = x * y;
    sum = x + y;
    difference = x - y;
    division = x / y;
    cout << "The product of " << x << " and " << y << " is " << product << endl;
    cout << "The sum of " << x << " and " << y << " is " << sum << endl;
    cout << "The difference of " << x << " and " << y << " is " << difference << endl;
    cout << "The Quotient of " << x << " over " << y << " is " << division << endl;
}


//AIzaSyDmEx_Jb-5xW1Zk00gFDK3GnFCFNWLc65U
