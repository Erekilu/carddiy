package top.lsyweb.carddiy;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

@SpringBootTest
class CarddiyApplicationTests
{

	@Test
	void contextLoads()
	{
		for (int n = -1000 ; n < 1000 ; n++)
		{
			for (int m = -1000 ; m < 1000 ; m++)
			{
				for (int k = -1000 ; k < 1000 ; k++)
				{
					if (6 * n == 30 && 2 * m + 2 * n == 20 && 6 * k + m == 17)
					{
						System.out.println(n + " " + m + " " + k);
						System.out.println(n + (m + 3 * k + 2 * n) * k);
					}

				}
			}
		}
	}

}
