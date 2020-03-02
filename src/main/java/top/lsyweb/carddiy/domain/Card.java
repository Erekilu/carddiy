package top.lsyweb.carddiy.domain;

import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Auther: Erekilu
 * @Date: 2020-02-25
 */
@Component
public class Card
{
	private String cardType;
	private Integer cardVersion;
	private Integer cardQuility;
	private String cardName;
	private String cardColor1;
	private String cardColor2;
	private Integer cardLife;
	private Integer cardStrength;
	private Integer cardSale;
	private String cardDesc;
	private String cardUuid;

	public Card()
	{
	}

	@Override
	public String toString()
	{
		return "Card{" + "cardType='" + cardType + '\'' + ", cardVersion='" + cardVersion + '\'' + ", cardQuility='"
				+ cardQuility + '\'' + ", cardName='" + cardName + '\'' + ", cardColor1='" + cardColor1 + '\''
				+ ", cardColor2='" + cardColor2 + '\'' + ", cardLife=" + cardLife + ", cardStrength=" + cardStrength
				+ ", cardSale=" + cardSale + ", cardDesc='" + cardDesc + '\'' + ", cardUuid='" + cardUuid + '\'' + '}';
	}

	public String getCardType()
	{
		return cardType;
	}

	public void setCardType(String cardType)
	{
		this.cardType = cardType;
	}

	public Integer getCardVersion()
	{
		return cardVersion;
	}

	public void setCardVersion(Integer cardVersion)
	{
		this.cardVersion = cardVersion;
	}

	public Integer getCardQuility()
	{
		return cardQuility;
	}

	public void setCardQuility(Integer cardQuility)
	{
		this.cardQuility = cardQuility;
	}

	public String getCardName()
	{
		return cardName;
	}

	public void setCardName(String cardName)
	{
		this.cardName = cardName;
	}

	public String getCardColor1()
	{
		return cardColor1;
	}

	public void setCardColor1(String cardColor1)
	{
		this.cardColor1 = cardColor1;
	}

	public String getCardColor2()
	{
		return cardColor2;
	}

	public void setCardColor2(String cardColor2)
	{
		this.cardColor2 = cardColor2;
	}

	public Integer getCardLife()
	{
		return cardLife;
	}

	public void setCardLife(Integer cardLife)
	{
		this.cardLife = cardLife;
	}

	public Integer getCardStrength()
	{
		return cardStrength;
	}

	public void setCardStrength(Integer cardStrength)
	{
		this.cardStrength = cardStrength;
	}

	public Integer getCardSale()
	{
		return cardSale;
	}

	public void setCardSale(Integer cardSale)
	{
		this.cardSale = cardSale;
	}

	public String getCardDesc()
	{
		return cardDesc;
	}

	public void setCardDesc(String cardDesc)
	{
		this.cardDesc = cardDesc;
	}

	public String getCardUuid()
	{
		return cardUuid;
	}

	public void setCardUuid(String cardUuid)
	{
		this.cardUuid = cardUuid;
	}
}
